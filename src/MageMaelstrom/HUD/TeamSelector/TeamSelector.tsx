import classNames from "classnames";
import React, { useMemo, useRef, useState } from "react";
import { Team } from "../..";
import { IdentifiedTeam } from "../../Combatant";
import { Stack } from "../../Common";
import { useGameManager, validate, warn } from "../../Logic";
import { useGameSpecs } from "../../Logic/GameSpecsProvider";
import { NiceButton } from "../NiceButton";
import { SelectableTeam } from "./SelectableTeam";
import styles from "./TeamSelector.module.css";

export interface TeamSelectorProps {
  teams: Team[];
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({ teams }) => {
  const [left, setLeft] = useState<IdentifiedTeam>();
  const [right, setRight] = useState<IdentifiedTeam>();

  const idCounterRef = useRef(1);

  const specs = useGameSpecs();

  const identifiedTeams = useMemo(
    () =>
      teams.map((t) => {
        const team: IdentifiedTeam = {
          ...t,
          id: idCounterRef.current++,
        };

        return {
          team,
          validationResult: validate(t, specs),
          warningResult: warn(t, specs),
        };
      }),
    [teams, specs]
  );

  const { startGame } = useGameManager();

  const clickTeam = (team: IdentifiedTeam) => {
    if (!left) {
      setLeft(team);
    } else if (!right) {
      setRight(team);
    }
  };

  return (
    <div style={{ paddingTop: 30 }}>
      <Stack alignment="middle">
        <Stack.Item>
          <div className="mageMaelstromTitle">Mage Maelstrom</div>
        </Stack.Item>
        <Stack.Item>
          <Stack alignment="middle" gap={20}>
            <div className={classNames(styles.openSlot, styles.openTeamSlot)}>
              {left && (
                <SelectableTeam
                  team={left}
                  onClick={() => setLeft(undefined)}
                />
              )}
            </div>
            <div className={styles.versus}>VS</div>
            <div className={classNames(styles.openSlot, styles.openTeamSlot)}>
              {right && (
                <SelectableTeam
                  team={right}
                  onClick={() => setRight(undefined)}
                />
              )}
            </div>
          </Stack>
        </Stack.Item>
        <Stack.Item>
          <Stack alignment="middle">
            {left && right && (
              <NiceButton large onClick={() => startGame(left, right)}>
                Commence Battle
              </NiceButton>
            )}
          </Stack>
        </Stack.Item>
      </Stack>
      <div className={classNames(styles.openSlot, styles.pool)}>
        <Stack style={{ flexWrap: "wrap" }}>
          {identifiedTeams.map((t) => (
            <SelectableTeam
              key={t.team.id}
              team={t.team}
              errors={t.validationResult.errors}
              warnings={t.warningResult.warnings}
              onClick={() => clickTeam(t.team)}
            />
          ))}
        </Stack>
      </div>
    </div>
  );
};
