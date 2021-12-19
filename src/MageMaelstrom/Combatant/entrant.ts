import { Coordinate, ReadonlyCoordinate } from "../Arena";
import { nextId } from "../Common";
import { ActionResult, Helpers, SpellResult } from "../Logic";
import {
  AbilityStatus,
  AbilityType,
  buildPassive,
  buildSpell,
  ExtendedSpellStatus,
  FullSpellTarget,
  isPassive,
  isSpell,
  Passive,
  Spell,
  StatusEffect,
  StatusEffectStatus,
  StatusEffectType,
} from "./Ability";
import { Combatant, CombatantDefinition } from "./combatant";
import { loggingManager } from "../Logging";
import { GameManager } from "../Logic/GameManager";

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
  vision: number;
  statusesEffects: StatusEffectType[];
}

export interface ReadonlyEntrant {
  combatant: CombatantDefinition;
  status: ReadonlyEntrantStatus;
  spells: ExtendedSpellStatus[];
  passives: AbilityStatus[];
  statusEffects: StatusEffectStatus[];
  color: string;
  flipped: boolean;
}

export class Entrant {
  private combatant: Combatant;

  private color: string;
  private flipped: boolean;
  private teamId: number;

  private id: number;
  private coords: Coordinate;
  private health: Meter;
  private mana: Meter;
  private ticksUntilNextTurn: number;

  private spells: Spell[];
  private passives: Passive[];
  private statusEffects: StatusEffect[];

  public constructor(
    combatant: Combatant,
    team: { color: string; flip: boolean; id: number },
    coords: Coordinate
  ) {
    this.combatant = combatant;
    this.coords = coords;

    this.color = team.color;
    this.flipped = team.flip;
    this.teamId = team.id;

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

    const abilities = this.combatant.getAbilities();

    this.statusEffects = [];
    this.spells = abilities.filter(isSpell).map((a) => buildSpell(a));
    this.passives = abilities.filter(isPassive).map((a) => buildPassive(a));
  }

  //~*~*~*~*~*~*
  // GETTERS

  public getId() {
    return this.id;
  }

  public getTeamId() {
    return this.teamId;
  }

  public getCombatant() {
    return this.combatant;
  }

  public getCoords() {
    return this.coords;
  }

  public getMaxStatBonus() {
    return this.passives.reduce(
      (sum, current) => (sum += current.getMaxStatAdjustment()),
      0
    );
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

  //~*~*~*~*
  // UPDATE

  public update() {
    this.ticksUntilNextTurn--;

    this.updateMeter(this.health);
    this.updateMeter(this.mana);

    this.spells.forEach((s) => s.update());
    this.statusEffects.forEach((e) => e.update(this));

    this.statusEffects = this.statusEffects.filter((e) => !e.isFinished());
  }

  private updateMeter(meter: Meter) {
    meter.value = Math.min(meter.max, meter.value + meter.regen / 100);
  }

  //~*~*~*~*
  // ACTIONS

  public act(helpers: Helpers, visibleEnemies: ReadonlyEntrantStatus[]) {
    this.ticksUntilNextTurn += this.combatant.getTurnDelay();
    return this.combatant.act(
      helpers,
      visibleEnemies,
      this.spells.map((s) => s.toReadonlySpell())
    );
  }

  public attack(target: Entrant) {
    const damage = this.combatant.getDamage();
    const mult = this.passives.some((p) => p.rollForCrit()) ? 2 : 1;

    target.takeDamage(damage * mult);

    loggingManager.logAttack({
      target: target.getId(),
      attacker: this.getId(),
      damage: damage * mult,
      remainingHealth: target.getHealth(),
      isCrit: mult !== 1,
    });
  }

  public canCast(
    spell: AbilityType,
    target: FullSpellTarget,
    gameManager: GameManager
  ): SpellResult {
    const actualSpell = this.spells.find((s) => s.getType() === spell);

    if (!actualSpell) {
      return "InvalidSpell";
    }

    return actualSpell.canCast(this, target, gameManager);
  }

  public cast(
    spell: AbilityType,
    target: FullSpellTarget,
    gameManager: GameManager
  ) {
    const actualSpell = this.spells.find((s) => s.getType() === spell);

    if (!actualSpell) {
      return;
    }

    actualSpell.cast(this, target, gameManager);
  }

  public takeDamage(amount: number) {
    this.health.value -= amount;
  }

  public drainMana(amount: number) {
    this.mana.value -= amount;
  }

  public applyStatusEffect(effect: StatusEffect) {
    this.statusEffects = this.statusEffects.filter(
      (e) => e.getType() !== effect.getType()
    );
    this.statusEffects.push(effect);
  }

  //~*~*~*~*~*~*
  // READONLY REACT STUFF

  public toReadonly(): ReadonlyEntrant {
    return {
      combatant: this.combatant.getDef(),
      status: this.getStatus(),
      spells: this.spells.map((s) => s.toExtendedReadonly()),
      passives: this.passives.map((p) => p.toReadonly()),
      statusEffects: this.statusEffects.map((s) => s.toReadonly()),
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
      vision: this.combatant.getVision(),
      statusesEffects: this.statusEffects.map((s) => s.getType()),
    };
  }
}
