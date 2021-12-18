import classNames from "classnames";
import React from "react";
import { ExtendedSpellStatus } from "../../Combatant";
import { DescribableDisplay } from "./DescribableDisplay";
import styles from "./SpellDisplay.module.css";

export interface SpellDisplayProps {
  spell: ExtendedSpellStatus;
}

export const SpellDisplay: React.FC<SpellDisplayProps> = ({ spell }) => {
  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.onCooldown]: spell.cooldownTimer > 0,
      })}
    >
      <div className={styles.icon}>
        <DescribableDisplay
          describable={spell}
          fade={spell.cooldownTimer > 0}
        />
      </div>
      <div
        className={styles.cooldownIndicator}
        style={{
          height:
            ((spell.cooldown - spell.cooldownTimer) / spell.cooldown) * 100 +
            "%",
        }}
      ></div>
    </div>
  );
};