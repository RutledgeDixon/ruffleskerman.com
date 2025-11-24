
import { useState } from 'react';
import CatanPlayersContainer from './PlayersContainer.jsx';
import NumberOfPlayersButton from './NumberOfPlayersButton.jsx';
import DiceRollButton from './DiceRollButton.jsx';
import '@/styles/catan-players.css';

const setBlankPlayer = (i) => {
    return {
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
    }
}

const CatanGame = () => {
    const [numberOfPlayers, setNumberOfPlayers] = useState(4);
    const [players, setPlayers] = useState(() =>
        Array.from({ length: numberOfPlayers }, (_, i) => setBlankPlayer(i))
    );

    const handleDiceRoll = (roll) => {
        const updatedPlayers = players.map(player => {
            const newResources = { ...player.resources };
            const diceResources = player.diceConfig[roll];
            if (diceResources) {
                for (const resource in diceResources) {
                    newResources[resource] += diceResources[resource];
                }
            }
            return { ...player, resources: newResources };
        });
        setPlayers(updatedPlayers);
    }

    const handleNumberOfPlayersChange = (newCount) => {
        setNumberOfPlayers(newCount);
        setPlayers((prevPlayers) => {
        const updated = [...prevPlayers];
        if (newCount > prevPlayers.length) {
            for (let i = prevPlayers.length; i < newCount; i++) {
                updated.push(setBlankPlayer(i));
            }
        } else {
            updated.splice(newCount);
        }
        return updated;
        });
    };

    return (
        <div>
            <div className="header">
                {/* <h1>Catan Card Counter</h1> */}
                {/* <NumberOfPlayersButton onChange={handleNumberOfPlayersChange} count={numberOfPlayers} /> */}
            </div>

            {/* Roll Die button (right) */}
            <DiceRollButton onRoll={handleDiceRoll} />

            {/* floating players button (left) for mobile */}
            <div className="floating-players-container">
                    <NumberOfPlayersButton floating onChange={handleNumberOfPlayersChange} count={numberOfPlayers} />
            </div>

            <div className="main-catan-center">
                <CatanPlayersContainer
                  players={players}
                  onResourceChange={(playerId, resource, change) => {
                    setPlayers((prev) => prev.map((p) =>
                      p.id === playerId ? { ...p, resources: { ...p.resources, [resource]: (p.resources[resource] + change) > 0 ? (p.resources[resource] + change) : 0 } } : p
                    ));
                  }}
                  onActionClick={(playerId, action) => {
                    let cost = { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 };
                    if (action === 'road') cost = { brick: 1, lumber: 1, ore: 0, wheat: 0, wool: 0 };
                    else if (action === 'settlement') cost = { brick: 1, lumber: 1, ore: 0, wheat: 1, wool: 1 };
                    else if (action === 'city') cost = { brick: 0, lumber: 0, ore: 3, wheat: 2, wool: 0 };
                    else if (action === 'devcard') cost = { brick: 0, lumber: 0, ore: 1, wheat: 1, wool: 1 };
                    setPlayers((prev) => prev.map((p) =>
                        p.id === playerId ? {
                            ...p,
                            resources: {
                            ...p.resources,
                            ...Object.fromEntries(
                                Object.entries(cost).map(([res, amt]) => [res, p.resources[res] - amt])
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
                          [diceNumber]: { 
                            ...p.diceConfig?.[diceNumber], 
                            [resource]: p.diceConfig?.[diceNumber][resource] + value < 0 
                                ? 0 
                                : p.diceConfig?.[diceNumber][resource] + value }
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
