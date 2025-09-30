# Catan Player Components

## Overview
The Catan Player components provide a reusable way to manage players in your Catan Card Counter application.

## Components

### 1. CatanPlayer (`src/components/catan/player.tsx`)
A single player component that renders:
- Player name header
- Resource adjustment buttons (+ / - for each resource)
- Building action buttons (Road, Settlement, City, Dev Card)
- Dice resource configuration inputs

#### Props:
```tsx
interface PlayerProps {
  playerId: number;                    // Unique player ID
  playerName?: string;                 // Display name (defaults to "Player X")
  onResourceChange?: (playerId: number, resource: string, dice: number, value: number) => void;
  onActionClick?: (playerId: number, action: string) => void;
}
```

### 2. CatanPlayersContainer (`src/components/catan/PlayersContainer.tsx`)
A container component that manages multiple players and their state.

#### Props:
```tsx
interface PlayersContainerProps {
  numberOfPlayers?: number;           // Default: 2
  onPlayerDataChange?: (players: PlayerData[]) => void;
}
```

## Usage Examples

### Basic Usage in Astro
```astro
---
import CatanPlayersContainer from '../components/catan/PlayersContainer';
---

<html>
  <body>
    <!-- Your other content -->
    <CatanPlayersContainer client:load numberOfPlayers={4} />
  </body>
</html>
```

### Custom Player Management
```tsx
import React from 'react';
import CatanPlayer from './catan/player';

function CustomPlayerManager() {
  const handleResourceChange = (playerId, resource, dice, value) => {
    console.log(`Player ${playerId} set ${resource} for dice ${dice} to ${value}`);
  };

  const handleActionClick = (playerId, action) => {
    console.log(`Player ${playerId} clicked ${action}`);
  };

  return (
    <div>
      <CatanPlayer 
        playerId={1}
        playerName="Alice"
        onResourceChange={handleResourceChange}
        onActionClick={handleActionClick}
      />
      <CatanPlayer 
        playerId={2}
        playerName="Bob"
        onResourceChange={handleResourceChange}
        onActionClick={handleActionClick}
      />
    </div>
  );
}
```

### Integration with Game Logic
```tsx
import React, { useState } from 'react';
import CatanPlayersContainer from './catan/PlayersContainer';

function CatanGame() {
  const [gameState, setGameState] = useState(null);

  const handlePlayerDataChange = (players) => {
    setGameState({ players });
    console.log('Updated player data:', players);
  };

  return (
    <div>
      <CatanPlayersContainer 
        numberOfPlayers={6}
        onPlayerDataChange={handlePlayerDataChange}
      />
      
      {/* Dice roller */}
      <div className="dice-section">
        {[2,3,4,5,6,8,9,10,11,12].map(dice => (
          <button key={dice} onClick={() => rollDice(dice)}>
            {dice}
          </button>
        ))}
      </div>
    </div>
  );
}
```

## Features

### ✅ **Automatic Resource Management**
- Each player maintains their own resource counts
- Dice configuration per player
- Building cost validation

### ✅ **Interactive Elements**
- Resource add/subtract buttons
- Building action buttons with automatic cost deduction
- Dice resource configuration inputs

### ✅ **State Management**
- Centralized player state
- Callback system for parent components
- Automatic UI updates

### ✅ **Customizable**
- Custom player names
- Variable number of players
- Configurable callbacks

## Building Actions

The components handle these building actions automatically:

| Action | Cost | Button ID Pattern |
|--------|------|------------------|
| Road | 1 Brick, 1 Lumber | `p{id}R` |
| Settlement | 1 Brick, 1 Lumber, 1 Wheat, 1 Wool | `p{id}S` |
| City | 2 Wheat, 3 Ore | `p{id}C` |
| Dev Card | 1 Wheat, 1 Wool, 1 Ore | `p{id}D` |

## Resource Actions

| Action | Description | Button ID Pattern |
|--------|-------------|------------------|
| Add Resource | Increases resource count by 1 | `p{id}{resource}A` |
| Subtract Resource | Decreases resource count by 1 | `p{id}{resource}S` |

## Data Structure

Each player object contains:
```tsx
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
  diceResources: {
    [dice: number]: {
      [resource: string]: number;
    };
  };
}
```

## Styling

The components use the existing CSS classes from your Catan Counter:
- `.player` - Player container
- `.hiddendisplay` - Expandable content area
- `.addingButton` - Resource/action buttons
- `.diceNums` - Dice configuration section
- `.diceNum` - Individual dice configuration
- `.resourceNums` - Resource input section

## Migration from HTML

The React components maintain the same IDs and structure as your original HTML, so existing JavaScript that references these elements should continue to work.

## Future Enhancements

Potential additions:
- Player color customization
- Victory point tracking
- Development card management
- Trade functionality
- Game history/undo
- Save/load game state