// TODO
// - Change the dice configuration to have a button for each number,
//   and then only show that number's config at a time - DONE
// - Give colors to each resource wherever they appear, or put the card image in the background
// - When the player name is clicked, show building actions and dice configuration, otherwise hide them

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
  onPlayerNameChange?: (playerId: number, newName: string) => void;
}

const CatanPlayer: React.FC<CatanPlayerProps> = ({
  playerId,
  playerName,
  resources = { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
  diceConfig = {},
  onResourceChange,
  onActionClick,
  onDiceConfigChange,
  onPlayerNameChange
}) => {
  const resourceNames: (keyof Resources)[] = ['brick', 'lumber', 'ore', 'wheat', 'wool'];
  const diceNumbers = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
  const [activeDiceNumber, setActiveDiceNumber] = useState<number>(2);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(playerName);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const buildingCosts = {
    road: { brick: 1, lumber: 1, ore: 0, wheat: 0, wool: 0 },
    settlement: { brick: 1, lumber: 1, ore: 0, wheat: 1, wool: 1 },
    city: { brick: 0, lumber: 0, ore: 3, wheat: 2, wool: 0 },
    devcard: { brick: 0, lumber: 0, ore: 1, wheat: 1, wool: 1 }
  };

  // Add state for managing click timeouts per resource
  const [clickTimeouts, setClickTimeouts] = useState<{ [key: string]: NodeJS.Timeout }>({});

  const canAfford = (action: keyof typeof buildingCosts) => {
    const cost = buildingCosts[action];
    return Object.entries(cost).every(([resource, amount]) => 
      resources[resource as keyof Resources] >= amount
    );
  };

  const handleResourceChange = (resource: keyof Resources, change: number) => {
    onResourceChange?.(playerId, resource, change);
  };

  // New handler for resource clicks (single for +1, double for -1)
  const handleResourceClick = (resource: keyof Resources) => {
    const key = resource as string;
    if (clickTimeouts[key]) {
      // Double-click detected: clear timeout and subtract
      clearTimeout(clickTimeouts[key]);
      setClickTimeouts((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      handleResourceChange(resource, -1);
    } else {
      // Single-click: set timeout for add
      const timeoutId = setTimeout(() => {
        handleResourceChange(resource, 1);
        setClickTimeouts((prev) => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      }, 300); // 300ms delay to detect double-click
      setClickTimeouts((prev) => ({ ...prev, [key]: timeoutId }));
    }
  };

  const handleConfigClick = (resource: keyof Resources) => {
    const key = resource as string;
    if (clickTimeouts[key]) {
      // Double-click detected: clear timeout and subtract
      clearTimeout(clickTimeouts[key]);
      setClickTimeouts((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      handleResourceChange(resource, -1);
    } else {
      // Single-click: set timeout for add
      const timeoutId = setTimeout(() => {
        handleResourceChange(resource, 1);
        setClickTimeouts((prev) => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      }, 300); // 300ms delay to detect double-click
      setClickTimeouts((prev) => ({ ...prev, [key]: timeoutId }));
    }
  };

  const handleActionClick = (action: string) => {
    onActionClick?.(playerId, action);
  };

  const handleDiceConfigChange = (diceNumber: number, resource: keyof Resources, value: number) => {
    onDiceConfigChange?.(playerId, diceNumber, resource, value);
  };

  const handleNameEdit = () => {
    setTempName(playerName);
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (tempName.trim() && tempName !== playerName) {
      onPlayerNameChange?.(playerId, tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(playerName);
    setIsEditingName(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  return (
    <div className="player">
        <div className="player-header">
            {isEditingName ? (
              <div className="name-edit-container">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={handleNameSave}
                  className="name-edit-input"
                  autoFocus
                  maxLength={20}
                />
              </div>
            ) : (
              <>
                <h3>{playerName}</h3>
                <button className='change-player-name-btn' onClick={handleNameEdit}>
                    ✏
                </button>
              </>
            )}
        </div>

        {/* Resources Display */}
        <div className="player-resources">
          {resourceNames.map((resource) => (
            <div
              key={resource}
              className="resource-item"
              onClick={() => handleResourceClick(resource)}
              onDoubleClick={() => {}} // Placeholder; logic handled in onClick
              style={{
                backgroundImage: `url(/images/${resource}.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* <div className="resource-label">{resource}</div> */}
              <div className="resource-count">{resources[resource]}</div>
              {/* Removed .resource-controls and + / - buttons */}
            </div>
          ))}
        </div>

        <button 
          className="resource-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details ▲' : 'Show Details ▼'}
        </button>

        {showDetails && (
          <>
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
                        max="15"
                        className="dice-input"
                        value={diceConfig[activeDiceNumber]?.[resource] || 0}
                        onChange={(e) => handleDiceConfigChange(activeDiceNumber, resource, parseInt(e.target.value) || 0)}
                        title={`${resource} on ${activeDiceNumber}`}
                    />
                    ))}
                </div>
            </div>
          </>
        )}
    </div>
  );
};

export default CatanPlayer;