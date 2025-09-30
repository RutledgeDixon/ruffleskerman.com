// Type definitions
interface Player {
    brick: number;
    lumber: number;
    ore: number;
    wheat: number;
    wool: number;
}

interface PlayerDiceParams {
    [key: number]: Player;
}

interface GamePlayer extends Player {
    diceParams: PlayerDiceParams;
}

// Catan Counter TypeScript Class
export class CatanCounterTS {
    private numPlayersElements: number = 0;
    private playersArr: (GamePlayer | undefined)[] = [];
    private player: Player = {
        brick: 0,
        lumber: 0,
        ore: 0,
        wheat: 0,
        wool: 0
    };

    constructor() {
        this.init();
    }

    private init(): void {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    private initializeApp(): void {
        this.numPlayersElements = document.querySelectorAll("div.player").length;
        this.createPlayers();
        this.setupDiceHandlers();
        this.setupPlayerHandButtons();
        this.setupPlayerCountModal();
        this.updatePlayerDisplay();
    }

    private createPlayers(): void {
        for(let i = 0; i < this.numPlayersElements; i++){
            this.playersArr[i+1] = {
                brick: 0,
                lumber: 0,
                ore: 0,
                wheat: 0,
                wool: 0,
                diceParams: {
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
            };
        }
    }

    private setupDiceHandlers(): void {
        const diceElements = document.querySelectorAll('.dice');
        diceElements.forEach(dice => {
            dice.addEventListener('click', () => {
                const diceNumber = parseInt((dice as HTMLElement).id.replace('dice', ''));
                this.handleDiceRoll(diceNumber);
            });
        });
    }

    private handleDiceRoll(diceNumber: number): void {
        for(let i = 1; i <= this.numPlayersElements; i++) {
            const playerObj = this.playersArr[i];
            if(playerObj && playerObj.diceParams[diceNumber]) {
                const resources = playerObj.diceParams[diceNumber];
                playerObj.brick += resources.brick;
                playerObj.lumber += resources.lumber;
                playerObj.ore += resources.ore;
                playerObj.wheat += resources.wheat;
                playerObj.wool += resources.wool;
            }
        }
        console.log(`Dice ${diceNumber} was rolled!`);
    }

    private setupPlayerHandButtons(): void {
        const buttons = [
            { id: 'roadB', cost: { brick: 1, lumber: 1, ore: 0, wheat: 0, wool: 0 }, name: 'Road' },
            { id: 'settlementB', cost: { brick: 1, lumber: 1, ore: 0, wheat: 1, wool: 1 }, name: 'Settlement' },
            { id: 'cityB', cost: { brick: 0, lumber: 0, ore: 3, wheat: 2, wool: 0 }, name: 'City' },
            { id: 'devCardB', cost: { brick: 0, lumber: 0, ore: 1, wheat: 1, wool: 1 }, name: 'Development Card' }
        ];

        buttons.forEach(button => {
            const btn = document.getElementById(button.id);
            if (btn) {
                btn.addEventListener('click', () => {
                    if (this.canAfford(button.cost)) {
                        this.spendResources(button.cost);
                        this.updatePlayerDisplay();
                    } else {
                        const costText = Object.entries(button.cost)
                            .filter(([, amount]) => amount > 0)
                            .map(([resource, amount]) => `${amount} ${resource}`)
                            .join(', ');
                        alert(`Not enough resources for ${button.name}! Need: ${costText}`);
                    }
                });
            }
        });
    }

    private canAfford(cost: Player): boolean {
        return Object.entries(cost).every(([resource, amount]) => 
            this.player[resource as keyof Player] >= amount
        );
    }

    private spendResources(cost: Player): void {
        Object.entries(cost).forEach(([resource, amount]) => {
            this.player[resource as keyof Player] -= amount;
        });
    }

    private setupPlayerCountModal(): void {
        const modal = document.getElementById('theDiv');
        const hideDiv = document.getElementById('theHideDiv');
        const numButton = document.getElementById('numButton');
        const playButton = document.getElementById('theButton2');

        if (numButton && hideDiv && modal) {
            numButton.addEventListener('click', () => {
                hideDiv.style.display = 'block';
                modal.style.top = '20%';
            });
        }

        if (playButton && hideDiv && modal) {
            playButton.addEventListener('click', () => {
                const numPlayersInput = document.getElementById('numPlayers') as HTMLInputElement;
                if (numPlayersInput) {
                    const numPlayers = numPlayersInput.value;
                    hideDiv.style.display = 'none';
                    modal.style.top = '-60%';
                    console.log(`Setting up game for ${numPlayers} players`);
                }
            });
        }
    }

    private updatePlayerDisplay(): void {
        const elements = {
            brick: document.getElementById('playerbrick'),
            lumber: document.getElementById('playerlumber'),
            ore: document.getElementById('playerore'),
            wheat: document.getElementById('playerwheat'),
            wool: document.getElementById('playerwool')
        };

        Object.entries(elements).forEach(([resource, element]) => {
            if (element) {
                element.textContent = this.player[resource as keyof Player].toString();
            }
        });
    }

    // Public API
    public addResource(resource: keyof Player, amount: number = 1): void {
        this.player[resource] += amount;
        this.updatePlayerDisplay();
    }

    public removeResource(resource: keyof Player, amount: number = 1): void {
        this.player[resource] = Math.max(0, this.player[resource] - amount);
        this.updatePlayerDisplay();
    }

    public getPlayerResources(): Player {
        return { ...this.player };
    }
}

// Auto-initialize
let catanGameTS: CatanCounterTS;

if (typeof window !== 'undefined') {
    catanGameTS = new CatanCounterTS();
    // Make it globally accessible
    (window as any).catanGame = catanGameTS;
}