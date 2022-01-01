import React from "react";
import { Arena } from "../../Arena";
import { Stack } from "../../Common";
import { TeamDisplay } from "..";
import { useGameManager } from "../../Logic";
import { NiceButton } from "../NiceButton";
import { BattleLogs } from "../BattleLogs";
import { Controls } from "./Controls";
import { Help } from "../Help";
import { useTeamSelection } from "../../Logic/TeamSelectionProvider";

export interface BattleProps {}

export const Battle: React.FC<BattleProps> = ({}) => {
  const { resetGame, clearGame } = useTeamSelection();
  const { leftTeam, rightTeam } = useGameManager();

  if (!leftTeam || !rightTeam) {
    return null;
  }

  return (
    <div style={{ padding: "0px 40px" }}>
      <Stack alignment="middle" gap={50}>
        <div
          className="mageMaelstromTitle"
          style={{ padding: "30px 0px", textAlign: "center" }}
        >
          Mage Maelstrom
        </div>
        <Stack.Item>
          <Stack alignment="end">
            <Stack gap={20}>
              <NiceButton onClick={resetGame}>Restart Game</NiceButton>
              <NiceButton onClick={clearGame}>New Game</NiceButton>
            </Stack>
          </Stack>
        </Stack.Item>
      </Stack>

      <Stack gap={30} alignment="middle" stretch>
        <Stack.Item>
          <Stack direction="vertical" stretch gap={20}>
            <Controls />
            <Stack stretch gap={5}>
              <Stack.Item>
                <TeamDisplay team={leftTeam} />
              </Stack.Item>
              <Arena leftVision={false} />
              <Stack.Item>
                <TeamDisplay team={rightTeam} />
              </Stack.Item>
            </Stack>
            <Help size={100} />
          </Stack>
        </Stack.Item>

        <Stack.Item size={0.25}>
          <BattleLogs />
        </Stack.Item>
      </Stack>
    </div>
  );
};
