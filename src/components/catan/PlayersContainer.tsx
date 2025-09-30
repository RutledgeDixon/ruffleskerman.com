import React, { useState, useCallback, useEffect } from 'react';
import CatanPlayer from './player';

interface PlayerData {
  id: number;
  name: string;
  resources: {
    brick: number;
    lumber: number;
    ore: number;
    wheat: number;
    wool: number;
  };
  diceConfig: {
    [key: number]: { brick: number; lumber: number; ore: number; wheat: number; wool: number; };
  };
}

interface PlayersContainerProps {
  players: PlayerData[];
  onResourceChange: (playerId: number, resource: keyof PlayerData['resources'], change: number) => void;
  onActionClick: (playerId: number, action: string) => void;
  onDiceConfigChange: (playerId: number, diceNumber: number, resource: keyof PlayerData['resources'], value: number) => void;
  onPlayerNameChange: (playerId: number, newName: string) => void;
}

const PlayersContainer: React.FC<PlayersContainerProps> = ({
  players,
  onResourceChange,
  onActionClick,
  onDiceConfigChange,
  onPlayerNameChange,
}) => {
  return (
    <div id="playerHands">
      {players.map((player) => (
        <CatanPlayer
          key={player.id}
          playerId={player.id}
          playerName={player.name}
          resources={player.resources}
          diceConfig={player.diceConfig || {}} // Pass diceConfig if available, else empty object
          onResourceChange={onResourceChange}
          onActionClick={onActionClick}
          onDiceConfigChange={onDiceConfigChange}
          onPlayerNameChange={onPlayerNameChange}
        />
      ))}
    </div>
  );
};

export default PlayersContainer;