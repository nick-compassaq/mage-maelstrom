import arrayShuffle from "array-shuffle";
import { coordsEqual, moveCoordinate } from "../Arena";
import {
  Action,
  ActionType,
  ActiveTeam,
  Entrant,
  IdentifiedCombatant,
  IdentifiedTeam,
  MovementAction,
} from "../Combatant";
import { ActionResult } from "./actionResult";
import { GameSpecs } from "./gameSpecs";
import { buildHelpers } from "./helpers";

export class GameManager {
  private specs: GameSpecs;

  private leftTeam?: ActiveTeam;
  private rightTeam?: ActiveTeam;

  private idTracker = 0;

  private currentTick = 0;

  public constructor(arenaWidth: number, arenaHeight: number) {
    this.specs = { arena: { width: arenaWidth, height: arenaHeight } };
  }

  public startGame(left: IdentifiedTeam, right: IdentifiedTeam) {
    this.currentTick = -1;

    this.leftTeam = this.buildActiveTeam(left, false);
    this.rightTeam = this.buildActiveTeam(right, true);
  }

  private buildActiveTeam(team: IdentifiedTeam, isRight: boolean): ActiveTeam {
    return {
      id: team.id,
      name: team.name,
      color: team.color,
      flip: isRight,
      entrants: team.combatants.map((c) => this.toEntrant(c, team)),
    };
  }

  private toEntrant(
    combatant: IdentifiedCombatant<object>,
    team: IdentifiedTeam
  ): Entrant<object> {
    return {
      combatant,
      team,
      memory: combatant.init(),
      status: {
        id: this.idTracker++,
        coords: {
          x: Math.floor(Math.random() * this.specs.arena.width),
          y: Math.floor(Math.random() * this.specs.arena.height),
        },
        nextTurn: 0,
      },
    };
  }

  private getNextTurn() {
    return this.currentTick + 10;
  }

  public getLeftTeam() {
    return this.leftTeam;
  }

  public getRightTeam() {
    return this.rightTeam;
  }

  public getCurrentTick() {
    return this.currentTick;
  }

  public tick() {
    if (!this.leftTeam || !this.rightTeam) {
      return;
    }

    this.currentTick++;

    const actionsToPerform = this.leftTeam.entrants
      .filter((e) => e.status.nextTurn === this.currentTick)
      .map((e) => ({
        entrant: e,
        action: e.combatant.act(
          buildHelpers((a: Action) => this.getActionResult(e, a)),
          e.memory
        ),
      }))
      .concat(
        this.rightTeam.entrants
          .filter((e) => e.status.nextTurn === this.currentTick)
          .map((e) => ({
            entrant: e,
            action: e.combatant.act(
              buildHelpers((a: Action) => this.getActionResult(e, a)),
              e.memory
            ),
          }))
      );

    const results = arrayShuffle(actionsToPerform).map((a) =>
      this.tryPerformAction(a.entrant, a.action)
    );

    return results.some((r) => r);
  }

  private tryPerformAction(entrant: Entrant<object>, action: Action) {
    entrant.status.nextTurn = this.getNextTurn();

    if (this.getActionResult(entrant, action) === ActionResult.Success) {
      this.performAction(entrant, action);

      return true;
    }

    return false;
  }

  private getActionResult(
    entrant: Entrant<object>,
    action: Action
  ): ActionResult {
    switch (action.type) {
      case ActionType.Movement:
        return this.canPerformMovementAction(entrant, action);
    }

    return ActionResult.UnknownAction;
  }

  private canPerformMovementAction(entrant: Entrant<object>, action: Action) {
    const result = moveCoordinate(entrant.status.coords, action.direction);

    if (
      result.x < 0 ||
      result.x >= this.specs.arena.width ||
      result.y < 0 ||
      result.y >= this.specs.arena.height
    ) {
      return ActionResult.OutOfArena;
    }

    if (
      this.getEntrantArray()
        .filter((e) => e.status.id !== entrant.status.id)
        .some((e) => coordsEqual(e.status.coords, result))
    ) {
      return ActionResult.TileOccupied;
    }

    return ActionResult.Success;
  }

  private performAction(entrant: Entrant<object>, action: Action) {
    switch (action.type) {
      case ActionType.Movement:
        this.move(entrant, action);
        break;
    }
  }

  private move(entrant: Entrant<object>, action: MovementAction) {
    entrant.status.coords = moveCoordinate(
      entrant.status.coords,
      action.direction
    );
  }

  private getEntrantArray() {
    if (!this.leftTeam || !this.rightTeam) {
      return [];
    }

    return this.leftTeam.entrants.concat(this.rightTeam.entrants);
  }
}
