
import React from 'react';
import CatanPlayer from './player.jsx';

const PlayersContainer = ({
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
          diceConfig={player.diceConfig || {}}
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
