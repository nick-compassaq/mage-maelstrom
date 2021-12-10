import React from "react";
import { Arena } from "../../Arena";
import { Stack } from "../../Common";
import { TeamDisplay } from "..";
import { useGameManager } from "../../Logic";
import { NiceButton } from "../NiceButton";
import { BattleLogs } from "../BattleLogs";

export interface BattleProps {}

export const Battle: React.FC<BattleProps> = ({}) => {
  const {
    leftTeam,
    rightTeam,
    tick,
    tickUntilNextAction,
    currentTick,
    toggleLooping,
    doFullReset,
    isLooping,
  } = useGameManager();

  if (!leftTeam || !rightTeam) {
    return null;
  }

  return (
    <div style={{ padding: "0px 100px" }}>
      <Stack alignment="middle" gap={50}>
        <div
          className="mageMaelstromTitle"
          style={{ padding: "30px 0px", textAlign: "center" }}
        >
          Mage Maelstrom
        </div>
        <Stack.Item>
          <Stack gap="apart" alignment="middle">
            <Stack gap={20}>
              <NiceButton onClick={tick}>Tick: {currentTick}</NiceButton>
              <NiceButton onClick={tickUntilNextAction}>Next Action</NiceButton>
              <NiceButton pressed={isLooping} onClick={toggleLooping}>
                {isLooping ? "Start " : "Stop "} Looping
              </NiceButton>
            </Stack>

            <NiceButton onClick={doFullReset}>New Game</NiceButton>
          </Stack>
        </Stack.Item>
      </Stack>

      <Stack gap={20} alignment="middle" stretch>
        <div>
          <Stack stretch>
            <TeamDisplay team={leftTeam} />
            <Arena />
            <TeamDisplay team={rightTeam} />
          </Stack>
        </div>

        <BattleLogs />
      </Stack>
    </div>
  );
};
