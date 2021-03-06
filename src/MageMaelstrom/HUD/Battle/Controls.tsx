import Slider from "rc-slider";
import React from "react";
import { NiceButton } from "..";
import { Stack } from "../../Common";
import { useGameManager } from "../../Logic";
import "rc-slider/assets/index.css";
import { Icon, mmCooldownTimer, mmPause, mmPlay } from "../../Common/Icon";
import styles from "./Controls.module.css";
import classNames from "classnames";

export interface ControlsProps {}

const TooltippedSlider = Slider.createSliderWithTooltip(Slider);

export const Controls = React.memo<ControlsProps>(() => {
  const {
    tick,
    currentTick,
    toggleLooping,
    isLooping,
    victor,
    gameSpeed,
    setGameSpeed,
    simulate,
    simulateFullGame,
  } = useGameManager();

  return (
    <Stack stretch gap={20}>
      <Stack stretch>
        <NiceButton
          pressed={isLooping}
          onClick={toggleLooping}
          disabled={victor !== undefined}
          style={{ width: 200 }}
        >
          <Icon icon={isLooping ? mmPause : mmPlay} size={32} inline />
        </NiceButton>
        <NiceButton onClick={tick} disabled={victor !== undefined}>
          +10<span style={{ fontFamily: "Body" }}>ms</span>
        </NiceButton>
        <NiceButton
          onClick={() => simulate(100)}
          disabled={victor !== undefined}
        >
          +1<span style={{ fontFamily: "Body" }}>s</span>
        </NiceButton>
        <NiceButton
          onClick={() => simulate(1000)}
          disabled={victor !== undefined}
        >
          +10<span style={{ fontFamily: "Body" }}>s</span>
        </NiceButton>
      </Stack>
      <div className={classNames(styles.tickCounter, styles.section)}>
        <Icon
          icon={mmCooldownTimer}
          size={16}
          inline
          style={{ marginRight: 5 }}
        />
        {((currentTick ?? 0) / 100).toFixed(2)}s
      </div>

      <Stack.Item>
        <Stack
          alignment="middle"
          className={classNames(styles.section, styles.sliderWrapper)}
          gap={20}
        >
          <div className={styles.gameSpeed}>Game Speed</div>
          <TooltippedSlider
            min={-1}
            max={1}
            step={0.01}
            marks={{
              0: "1x",
              [-1]: "0.1x",
              1: "10x",
              0.398: "2.5x",
              [-0.398]: "0.4x",
            }}
            value={Math.log10(gameSpeed)}
            onChange={(value) => setGameSpeed(Math.pow(10, value))}
            tipFormatter={(v) => Math.pow(10, v).toFixed(2) + "x"}
          />
        </Stack>
      </Stack.Item>
      <NiceButton onClick={simulateFullGame} disabled={victor !== undefined}>
        Skip to End
      </NiceButton>
    </Stack>
  );
});
