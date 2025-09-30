// TODO
// - make only one player visible at a time, with a dropdown menu to select the player - DONE

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
  numberOfPlayers?: number;
  onPlayerDataChange?: (players: PlayerData[]) => void;
}

const CatanPlayersContainer: React.FC<PlayersContainerProps> = ({ 
  numberOfPlayers = 4, 
  onPlayerDataChange 
}) => {
  const [players, setPlayers] = useState<PlayerData[]>(() => {
    return Array.from({ length: numberOfPlayers }, (_, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`,
      resources: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
      diceConfig: {
        2: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        3: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        4: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        5: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        6: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        8: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        9: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        10: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        11: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        12: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 }
      }
    }));
  });
  const [activePlayer, setActivePlayer] = useState<number>(1);

  const [currentNumberOfPlayers, setCurrentNumberOfPlayers] = useState(numberOfPlayers);

  useEffect(() => {
    setCurrentNumberOfPlayers(numberOfPlayers);
  }, [numberOfPlayers]);

  useEffect(() => {
    const handler = (e: CustomEvent) => setCurrentNumberOfPlayers(e.detail);
    window.addEventListener('updatePlayers', handler as EventListener);
    return () => window.removeEventListener('updatePlayers', handler as EventListener);
  }, []);

  useEffect(() => {
    setPlayers(Array.from({ length: currentNumberOfPlayers }, (_, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`,
      resources: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
      diceConfig: {
        2: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        3: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        4: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        5: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        6: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        8: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        9: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        10: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        11: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
        12: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 }
      }
    })));
    setActivePlayer(1);
  }, [currentNumberOfPlayers]);

  const handleResourceChange = useCallback((playerId: number, resource: keyof PlayerData['resources'], change: number) => {
    setPlayers(prevPlayers => {
      const newPlayers = prevPlayers.map(player => {
        if (player.id === playerId) {
          const newResources = {
            ...player.resources,
            [resource]: Math.max(0, player.resources[resource] + change)
          };
          return { ...player, resources: newResources };
        }
        return player;
      });
      onPlayerDataChange?.(newPlayers);
      return newPlayers;
    });
  }, [onPlayerDataChange]);

  const handleActionClick = useCallback((playerId: number, action: string) => {
    const costs = {
      road: { brick: 1, lumber: 1, ore: 0, wheat: 0, wool: 0 },
      settlement: { brick: 1, lumber: 1, ore: 0, wheat: 1, wool: 1 },
      city: { brick: 0, lumber: 0, ore: 3, wheat: 2, wool: 0 },
      devcard: { brick: 0, lumber: 0, ore: 1, wheat: 1, wool: 1 }
    };

    const cost = costs[action as keyof typeof costs];
    if (!cost) return;

    setPlayers(prevPlayers => {
      const newPlayers = prevPlayers.map(player => {
        if (player.id === playerId) {
          // Check if player can afford the action
          const canAfford = Object.entries(cost).every(([resource, amount]) => 
            player.resources[resource as keyof PlayerData['resources']] >= amount
          );

          if (canAfford) {
            const newResources = { ...player.resources };
            Object.entries(cost).forEach(([resource, amount]) => {
              newResources[resource as keyof PlayerData['resources']] -= amount;
            });
            return { ...player, resources: newResources };
          }
        }
        return player;
      });
      onPlayerDataChange?.(newPlayers);
      return newPlayers;
    });
  }, [onPlayerDataChange]);

  const handleDiceConfigChange = useCallback((playerId: number, diceNumber: number, resource: keyof PlayerData['resources'], value: number) => {
    setPlayers(prevPlayers => {
      const newPlayers = prevPlayers.map(player => {
        if (player.id === playerId) {
          const newDiceConfig = {
            ...player.diceConfig,
            [diceNumber]: {
              ...player.diceConfig[diceNumber],
              [resource]: Math.max(0, value)
            }
          };
          return { ...player, diceConfig: newDiceConfig };
        }
        return player;
      });
      onPlayerDataChange?.(newPlayers);
      return newPlayers;
    });
  }, [onPlayerDataChange]);

  const handlePlayerNameChange = useCallback((playerId: number, newName: string) => {
    setPlayers(prevPlayers => {
      const newPlayers = prevPlayers.map(player => {
        if (player.id === playerId) {
          return { ...player, name: newName };
        }
        return player;
      });
      onPlayerDataChange?.(newPlayers);
      return newPlayers;
    });
  }, [onPlayerDataChange]);

  // Get the currently active player data
  const currentPlayer = players.find(player => player.id === activePlayer);
  
  // Fallback if no player found (shouldn't happen, but for type safety)
  if (!currentPlayer) {
    return <div>Player not found</div>;
  }

  return (
    <div className="players-container">
      {/* Player Selection Dropdown
      <div className="player-selector">
        <label htmlFor="player-select" className="player-selector-label">
          Select Player:
        </label>
        <select
          id="player-select"
          className="player-select-dropdown"
          value={activePlayer}
          onChange={e => setActivePlayer(Number(e.target.value))}
        >
          {players.map(player => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div> */}

      {players.map(player => (
        <CatanPlayer
          key={player.id}
          playerId={player.id}
          playerName={player.name}
          resources={player.resources}
          diceConfig={player.diceConfig}
          onResourceChange={handleResourceChange}
          onActionClick={handleActionClick}
          onDiceConfigChange={handleDiceConfigChange}
          onPlayerNameChange={handlePlayerNameChange}
        />
      ))}
    </div>
  );
};

export default CatanPlayersContainer;