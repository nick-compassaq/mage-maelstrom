import { Coordinate, ReadonlyCoordinate } from "../Arena";
import { nextId } from "../Common";
import { ActionResult, Helpers } from "../Logic";
import { AttackLog, LogType } from "../Logic/logs";
import {
  AbilityType,
  buildSpell,
  FullSpellTarget,
  isSpell,
  Spell,
  SpellTarget,
} from "./Abilities";
import { Combatant, CombatantDefinition } from "./combatant";

interface Meter {
  value: number;
  max: number;
  regen: number;
}

export interface ReadonlyEntrantStatus {
  id: number;
  health: Meter;
  mana: Meter;
  coords: ReadonlyCoordinate;
  ticksUntilNextTurn: number;
}

export interface ReadonlyEntrant {
  combatant: CombatantDefinition;
  status: ReadonlyEntrantStatus;
  color: string;
  flipped: boolean;
}

export class Entrant {
  private combatant: Combatant;

  private color: string;
  private flipped: boolean;

  private id: number;
  private coords: Coordinate;
  private health: Meter;
  private mana: Meter;
  private ticksUntilNextTurn: number;

  private spells: Spell[];

  public constructor(
    combatant: Combatant,
    color: string,
    flipped: boolean,
    coords: Coordinate
  ) {
    this.combatant = combatant;
    this.coords = coords;

    this.color = color;
    this.flipped = flipped;

    this.id = nextId();
    this.health = {
      max: combatant.getMaxHealth(),
      value: combatant.getMaxHealth(),
      regen: combatant.getHealthRegen(),
    };

    this.mana = {
      max: combatant.getMaxMana(),
      value: combatant.getMaxMana(),
      regen: combatant.getManaRegen(),
    };

    this.ticksUntilNextTurn = Math.ceil(
      Math.random() * combatant.getTurnDelay()
    );

    this.spells = this.combatant
      .getAbilities()
      .filter((a) => isSpell(a))
      .map((a) => buildSpell(a));
  }

  public getId() {
    return this.id;
  }

  public getCoords() {
    return this.coords;
  }

  public update() {
    this.ticksUntilNextTurn--;

    this.updateMeter(this.health);
    this.updateMeter(this.mana);

    this.spells.forEach((s) => s.update());
  }

  private updateMeter(meter: Meter) {
    meter.value = Math.min(meter.max, meter.value + meter.regen / 100);
  }

  public isMyTurn() {
    return this.ticksUntilNextTurn <= 0;
  }

  public getHealth() {
    return this.health.value;
  }

  public getMana() {
    return this.mana.value;
  }

  public isDead() {
    return this.health.value <= 0;
  }

  public act(helpers: Helpers, visibleEnemies: ReadonlyEntrantStatus[]) {
    this.ticksUntilNextTurn += this.combatant.getTurnDelay();
    return this.combatant.act(
      helpers,
      visibleEnemies,
      this.spells.map((s) => s.toReadonly())
    );
  }

  public attack(target: Entrant): AttackLog {
    const damage = this.combatant.getDamage();

    target.takeDamage(damage);

    return {
      id: nextId(),
      type: LogType.Attack,
      target: target.getId(),
      attacker: this.getId(),
      damage: damage,
      remainingHealth: target.getHealth(),
    };
  }

  public canCast(spell: AbilityType, target: FullSpellTarget) {
    const actualSpell = this.spells.find((s) => s.getType() === spell);

    if (!actualSpell) {
      return ActionResult.InvalidSpell;
    }

    if (actualSpell.isOnCooldown()) {
      return ActionResult.OnCooldown;
    }

    if (this.mana.value < actualSpell.getManaCost()) {
      return ActionResult.NotEnoughMana;
    }

    return ActionResult.Success;
  }

  public cast(spell: AbilityType, target: FullSpellTarget) {
    const actualSpell = this.spells.find((s) => s.getType() === spell);

    if (!actualSpell) {
      return;
    }

    actualSpell.cast(this, target);
  }

  public takeDamage(amount: number) {
    this.health.value -= amount;
  }

  public drainMana(amount: number) {
    this.mana.value -= amount;
  }

  public toReadonly(): ReadonlyEntrant {
    return {
      combatant: this.combatant.getDef(),
      status: this.getStatus(),
      color: this.color,
      flipped: this.flipped,
    };
  }

  public getStatus(): ReadonlyEntrantStatus {
    return {
      id: this.id,
      health: { ...this.health },
      mana: { ...this.mana },
      ticksUntilNextTurn: this.ticksUntilNextTurn,
      coords: this.coords.toReadonly(),
    };
  }
}
