// filepath: src/components/catan/CatanGame.tsx
import { useState } from 'react';
import CatanPlayersContainer from './PlayersContainer';
import NumberOfPlayersButton from './NumberOfPlayersButton';
import '@/styles/catan-players.css';

// TODO
// - refactor and simplify

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

const CatanGame = () => {
    //Initialize players
    const [numberOfPlayers, setNumberOfPlayers] = useState(4);
    const [players, setPlayers] = useState<PlayerData[]>(() =>
        Array.from({ length: numberOfPlayers }, (_, i) => ({
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
        }))
    );

    //updates each player resource with the correct number, based on their dice config
    //sets the players with the new updated data
    const handleDiceRoll = (roll: number) => {
        const updatedPlayers = players.map(player => {
            const newResources = { ...player.resources };
            const diceResources = player.diceConfig[roll];

            if (diceResources) {
                for (const resource in diceResources) {
                    const key = resource as keyof typeof newResources;
                    newResources[key] += diceResources[key];
                }
            }

            return { ...player, resources: newResources };
        });

        setPlayers(updatedPlayers);
    }

    // Update players when numberOfPlayers changes
    const handleNumberOfPlayersChange = (newCount: number) => {
        setNumberOfPlayers(newCount);
        setPlayers((prevPlayers) => {
        const updated = [...prevPlayers];
        if (newCount > prevPlayers.length) {
            // Add new players
            for (let i = prevPlayers.length; i < newCount; i++) {
            updated.push({
                id: i + 1,
                name: `Player ${i + 1}`,
                resources: { lumber: 0, brick: 0, wool: 0, wheat: 0, ore: 0 },
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
            });
            }
        } else {
            // Remove excess players
            updated.splice(newCount);
        }
        return updated;
        });
    };

    return (
        <div>
            <div className="header">
                <h1>Catan Card Counter</h1>
                <NumberOfPlayersButton onChange={handleNumberOfPlayersChange} />
            </div>
        
            <div className="diceDiv">
                {/* Render dice as buttons with click handlers */}
                {[2, 3, 4, 5, 6, 8, 9, 10, 11, 12].map((num) => (
                <button
                    key={num}
                    className="dice"
                    id={`dice${num}`}
                    onClick={() => handleDiceRoll(num)}
                >
                    {num}
                </button>
                ))}
            </div>
        
            <div className="main-catan-center">
                <CatanPlayersContainer
                  players={players}
                  onResourceChange={(playerId, resource, change) => {
                    setPlayers((prev) => prev.map((p) =>
                      p.id === playerId ? { ...p, resources: { ...p.resources, [resource]: p.resources[resource] + change } } : p
                    ));
                  }}
                  onActionClick={(playerId, action) => {
                    // Handle building actions, e.g., deduct costs from resources
                    // Example: if action === 'road', deduct costs and log
                    let cost = { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 };
                    if (action === 'road') cost = { brick: 1, lumber: 1, ore: 0, wheat: 0, wool: 0 };
                    else if (action === 'settlement') cost = { brick: 1, lumber: 1, ore: 0, wheat: 1, wool: 1 };
                    else if (action === 'city') cost = { brick: 0, lumber: 0, ore: 3, wheat: 2, wool: 0 };
                    else if (action === 'devcard') cost = { brick: 0, lumber: 0, ore: 1, wheat: 1, wool: 1 };
                    //deduct the cost from the player with playerId
                    setPlayers((prev) => prev.map((p) =>
                        p.id === playerId ? {
                            ...p,
                            resources: {
                            ...p.resources,
                            ...Object.fromEntries(
                                Object.entries(cost).map(([res, amt]) => [res, p.resources[res as keyof typeof p.resources] - amt])
                            )
                            }
                        } : p
                    ));
                    console.log(`Player ${playerId} built a ${action}`);
                  }}
                  onDiceConfigChange={(playerId, diceNumber, resource, value) => {
                    setPlayers((prev) => prev.map((p) =>
                      p.id === playerId ? {
                        ...p,
                        diceConfig: {
                          ...p.diceConfig,
                          [diceNumber]: { ...p.diceConfig?.[diceNumber], [resource]: value }
                        }
                      } : p
                    ));
                  }}
                  onPlayerNameChange={(playerId, newName) => {
                    setPlayers((prev) => prev.map((p) =>
                      p.id === playerId ? { ...p, name: newName } : p
                    ));
                  }}
                />
            </div>
        </div>
    );
}
export default CatanGame;
