// TODO
// - Change the dice configuration to have a button for each number,
//   and then only show that number's config at a time - DONE
import React from 'react';
import { useState } from "react";

interface Resources {
  brick: number;
  lumber: number;
  ore: number;
  wheat: number;
  wool: number;
}

interface DiceConfig {
  [key: number]: Resources;
}

interface CatanPlayerProps {
  playerId: number;
  playerName: string;
  resources?: Resources;
  diceConfig?: DiceConfig;
  onResourceChange?: (playerId: number, resource: keyof Resources, change: number) => void;
  onActionClick?: (playerId: number, action: string) => void;
  onDiceConfigChange?: (playerId: number, diceNumber: number, resource: keyof Resources, value: number) => void;
}

const CatanPlayer: React.FC<CatanPlayerProps> = ({
  playerId,
  playerName,
  resources = { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
  diceConfig = {},
  onResourceChange,
  onActionClick,
  onDiceConfigChange
}) => {
  const resourceNames: (keyof Resources)[] = ['brick', 'lumber', 'ore', 'wheat', 'wool'];
  const diceNumbers = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
  const [activeDiceNumber, setActiveDiceNumber] = useState<number>(2);
  const buildingCosts = {
    road: { brick: 1, lumber: 1, ore: 0, wheat: 0, wool: 0 },
    settlement: { brick: 1, lumber: 1, ore: 0, wheat: 1, wool: 1 },
    city: { brick: 0, lumber: 0, ore: 3, wheat: 2, wool: 0 },
    devcard: { brick: 0, lumber: 0, ore: 1, wheat: 1, wool: 1 }
  };

  const canAfford = (action: keyof typeof buildingCosts) => {
    const cost = buildingCosts[action];
    return Object.entries(cost).every(([resource, amount]) => 
      resources[resource as keyof Resources] >= amount
    );
  };

  const handleResourceChange = (resource: keyof Resources, change: number) => {
    onResourceChange?.(playerId, resource, change);
  };

  const handleActionClick = (action: string) => {
    onActionClick?.(playerId, action);
  };

  const handleDiceConfigChange = (diceNumber: number, resource: keyof Resources, value: number) => {
    onDiceConfigChange?.(playerId, diceNumber, resource, value);
  };

  return (
    <div className="player">
      <h3>{playerName}</h3>
      
      {/* Resources Display */}
      <div className="player-resources">
        {resourceNames.map((resource) => (
          <div key={resource} className="resource-item">
            <div className="resource-label">{resource}</div>
            <div className="resource-count">{resources[resource]}</div>
            <div className="resource-controls">
              <button 
                className="resource-btn"
                onClick={() => handleResourceChange(resource, -1)}
              >
                −
              </button>
              <button 
                className="resource-btn"
                onClick={() => handleResourceChange(resource, 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Building Actions */}
      <div className="player-actions">
        <button 
          className="action-btn"
          disabled={!canAfford('road')}
          onClick={() => handleActionClick('road')}
        >
          Road
        </button>
        <button 
          className="action-btn"
          disabled={!canAfford('settlement')}
          onClick={() => handleActionClick('settlement')}
        >
          Settlement
        </button>
        <button 
          className="action-btn"
          disabled={!canAfford('city')}
          onClick={() => handleActionClick('city')}
        >
          City
        </button>
        <button 
          className="action-btn"
          disabled={!canAfford('devcard')}
          onClick={() => handleActionClick('devcard')}
        >
          Dev Card
        </button>
      </div>

      {/* Dice Configuration */}
      <div className="dice-config">
        <h4>Dice Configuration</h4>
        <div className="dice-inputs">
            {diceNumbers.map((diceNum) => (
              <button 
                key={diceNum}
                className="dice-label"
                onClick={() => setActiveDiceNumber(diceNum)}
              >
                {diceNum}
              </button>
            ))}
        </div>
        <div className="dice-input-group">
            <div className="dice-label">{activeDiceNumber}</div>
            {resourceNames.map((resource) => (
            <input
                key={`${activeDiceNumber}-${resource}`}
                type="number"
                min="0"
                max="5"
                className="dice-input"
                value={diceConfig[activeDiceNumber]?.[resource] || 0}
                onChange={(e) => handleDiceConfigChange(activeDiceNumber, resource, parseInt(e.target.value) || 0)}
                title={`${resource} on ${activeDiceNumber}`}
            />
            ))}
        </div>
      </div>
    </div>
  );
};

export default CatanPlayer;