// Catan Counter Game Logic
class CatanCounter {
    constructor() {
        this.numPlayersElements = 0;
        this.playersArr = [];
        this.player = {
            brick: 0,
            lumber: 0,
            ore: 0,
            wheat: 0,
            wool: 0
        };
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        // Setting up the numPlayers variable
        this.numPlayersElements = document.querySelectorAll("div.player").length;

        // Creating the players
        this.createPlayers();
        
        // Setup dice click handlers
        this.setupDiceHandlers();

        // Setup player hand buttons
        this.setupPlayerHandButtons();
        
        // Setup number of players functionality
        this.setupPlayerCountModal();
        
        // Update displays
        this.updatePlayerDisplay();
    }

    createPlayers() {
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

    setupDiceHandlers() {
        const diceElements = document.querySelectorAll('.dice');
        diceElements.forEach(dice => {
            dice.addEventListener('click', () => {
                const diceNumber = parseInt(dice.id.replace('dice', ''));
                this.handleDiceRoll(diceNumber);
            });
        });
    }

    handleDiceRoll(diceNumber) {
        // Add resources to each player based on their dice settings
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
        
        // Add resources to main player
        // This would be based on your settlements/cities on the rolled number
        // For now, this is a placeholder
        console.log(`Dice ${diceNumber} was rolled!`);
    }

    setupPlayerHandButtons() {
        // Road button
        const roadBtn = document.getElementById('roadB');
        if (roadBtn) {
            roadBtn.addEventListener('click', () => {
                if(this.player.brick >= 1 && this.player.lumber >= 1) {
                    this.player.brick -= 1;
                    this.player.lumber -= 1;
                    this.updatePlayerDisplay();
                } else {
                    alert('Not enough resources for Road! Need: 1 Brick, 1 Lumber');
                }
            });
        }

        // Settlement button  
        const settlementBtn = document.getElementById('settlementB');
        if (settlementBtn) {
            settlementBtn.addEventListener('click', () => {
                if(this.player.brick >= 1 && this.player.lumber >= 1 && this.player.wheat >= 1 && this.player.wool >= 1) {
                    this.player.brick -= 1;
                    this.player.lumber -= 1;
                    this.player.wheat -= 1;
                    this.player.wool -= 1;
                    this.updatePlayerDisplay();
                } else {
                    alert('Not enough resources for Settlement! Need: 1 Brick, 1 Lumber, 1 Wheat, 1 Wool');
                }
            });
        }

        // City button
        const cityBtn = document.getElementById('cityB');
        if (cityBtn) {
            cityBtn.addEventListener('click', () => {
                if(this.player.wheat >= 2 && this.player.ore >= 3) {
                    this.player.wheat -= 2;
                    this.player.ore -= 3;
                    this.updatePlayerDisplay();
                } else {
                    alert('Not enough resources for City! Need: 2 Wheat, 3 Ore');
                }
            });
        }

        // Development Card button
        const devCardBtn = document.getElementById('devCardB');
        if (devCardBtn) {
            devCardBtn.addEventListener('click', () => {
                if(this.player.wheat >= 1 && this.player.wool >= 1 && this.player.ore >= 1) {
                    this.player.wheat -= 1;
                    this.player.wool -= 1;
                    this.player.ore -= 1;
                    this.updatePlayerDisplay();
                } else {
                    alert('Not enough resources for Development Card! Need: 1 Wheat, 1 Wool, 1 Ore');
                }
            });
        }
    }

    setupPlayerCountModal() {
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
                const numPlayersInput = document.getElementById('numPlayers');
                if (numPlayersInput && numPlayersInput instanceof HTMLInputElement) {
                    const numPlayers = numPlayersInput.value;
                    hideDiv.style.display = 'none';
                    modal.style.top = '-60%';
                    console.log(`Setting up game for ${numPlayers} players`);
                    // Here you would dynamically create player divs based on numPlayers
                }
            });
        }
    }

    updatePlayerDisplay() {
        const brickEl = document.getElementById('playerbrick');
        const lumberEl = document.getElementById('playerlumber');
        const oreEl = document.getElementById('playerore');
        const wheatEl = document.getElementById('playerwheat');
        const woolEl = document.getElementById('playerwool');
        
        if (brickEl) brickEl.textContent = this.player.brick.toString();
        if (lumberEl) lumberEl.textContent = this.player.lumber.toString();
        if (oreEl) oreEl.textContent = this.player.ore.toString();
        if (wheatEl) wheatEl.textContent = this.player.wheat.toString();
        if (woolEl) woolEl.textContent = this.player.wool.toString();
    }

    // Public methods for external access
    addResource(resource, amount = 1) {
        if (this.player.hasOwnProperty(resource)) {
            this.player[resource] += amount;
            this.updatePlayerDisplay();
        }
    }

    removeResource(resource, amount = 1) {
        if (this.player.hasOwnProperty(resource)) {
            this.player[resource] = Math.max(0, this.player[resource] - amount);
            this.updatePlayerDisplay();
        }
    }

    getPlayerResources() {
        return { ...this.player };
    }
}

// Initialize the game when script loads
let catanGame;

// Export for module use or create global instance
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CatanCounter;
} else {
    // Create global instance
    catanGame = new CatanCounter();
}