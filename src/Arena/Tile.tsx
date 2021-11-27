import React from "react";
import { Combatant, CombatantIcon } from "../Combatant";
import styles from "./Tile.module.css";

export interface TileProps {
  combatant?: Combatant;
  teamColor?: string;
}

export const Tile: React.FC<TileProps> = ({ combatant, teamColor }) => {
  return (
    <div className={styles.tile}>
      {combatant && teamColor && (
        <CombatantIcon combatant={combatant} teamColor={teamColor} />
      )}
    </div>
  );
};
