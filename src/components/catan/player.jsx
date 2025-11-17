
import React, { useState } from "react";

const resourceNames = ['brick', 'lumber', 'ore', 'wheat', 'wool'];
const diceNumbers = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
const buildingCosts = {
  road: { brick: 1, lumber: 1, ore: 0, wheat: 0, wool: 0 },
  settlement: { brick: 1, lumber: 1, ore: 0, wheat: 1, wool: 1 },
  city: { brick: 0, lumber: 0, ore: 3, wheat: 2, wool: 0 },
  devcard: { brick: 0, lumber: 0, ore: 1, wheat: 1, wool: 1 }
};

const CatanPlayer = ({
  playerId,
  playerName,
  resources = { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
  diceConfig = {},
  onResourceChange,
  onActionClick,
  onDiceConfigChange,
  onPlayerNameChange
}) => {
  const [activeDiceNumber, setActiveDiceNumber] = useState(2);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName);
  const [showDetails, setShowDetails] = useState(false);
  const [clickTimeouts, setClickTimeouts] = useState({});

  const canAfford = (action) => {
    const cost = buildingCosts[action];
    return Object.entries(cost).every(([resource, amount]) => 
      resources[resource] >= amount
    );
  };

  const handleResourceChange = (resource, change) => {
    if (onResourceChange) onResourceChange(playerId, resource, change);
  };

  const handleResourceClick = (resource) => {
    const key = resource;
    if (clickTimeouts[key]) {
      clearTimeout(clickTimeouts[key]);
      setClickTimeouts((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      handleResourceChange(resource, -1);
    } else {
      const timeoutId = setTimeout(() => {
        handleResourceChange(resource, 1);
        setClickTimeouts((prev) => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      }, 300);
      setClickTimeouts((prev) => ({ ...prev, [key]: timeoutId }));
    }
  };

  const handleConfigClick = (resource) => {
    const key = resource;
    if (clickTimeouts[key]) {
      clearTimeout(clickTimeouts[key]);
      setClickTimeouts((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      if (onDiceConfigChange) onDiceConfigChange(playerId, activeDiceNumber, resource, -1);
    } else {
      const timeoutId = setTimeout(() => {
        if (onDiceConfigChange) onDiceConfigChange(playerId, activeDiceNumber, resource, 1);
        setClickTimeouts((prev) => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      }, 300);
      setClickTimeouts((prev) => ({ ...prev, [key]: timeoutId }));
    }
  };

  const handleActionClick = (action) => {
    if (onActionClick) onActionClick(playerId, action);
  };

  const handleDiceConfigChange = (diceNumber, resource, value) => {
    if (onDiceConfigChange) onDiceConfigChange(playerId, diceNumber, resource, value);
  };

  const handleNameEdit = () => {
    setTempName(playerName);
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (tempName.trim() && tempName !== playerName) {
      if (onPlayerNameChange) onPlayerNameChange(playerId, tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(playerName);
    setIsEditingName(false);
  };

  const handleKeyPress = (e) => {
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
                position: 'relative',
                display: 'inline-block'
              }}
            >
              <img
                src={`/images/${resource}.png`}
                alt={resource}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  filter: 'brightness(0.7)'
                }}
              />
              <div 
                className="resource-count"
                style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}
              >
                {resources[resource]}
              </div>
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
                    <div className="dice-label">{activeDiceNumber + " :"}</div>
                    {resourceNames.map((resource) => (
                        <div
                        key={`${activeDiceNumber}-${resource}`}
                        className="dice-input"
                        onClick={() => handleConfigClick(resource)}
                        onDoubleClick={() => {}} // Placeholder; logic handled in onClick
                        style={{
                          backgroundImage: `url(/images/${resource}.png)`,
                          backgroundSize: '60px auto',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          userSelect: 'none',
                          filter: 'brightness(0.8)'
                        }}
                        >
                        <span style={{ color: 'white' }}>
                          {diceConfig[activeDiceNumber]?.[resource] ?? 0}
                        </span>
                        </div>
                  ))}
                </div>
            </div>
          </>
        )}
    </div>
  );
};

export default CatanPlayer;
