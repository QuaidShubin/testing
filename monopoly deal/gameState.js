// Game state object
const gameState = {
    started: false,
    currentPlayer: 1,
    deck: [],
    discardPile: [],
    cardsPlayedThisTurn: 0,
    cardsDrawnThisTurn: 0,
    players: {
        1: {
            hand: [],
            properties: [],
            moneyPiles: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 10: 0}
        },
        2: {
            hand: [],
            properties: [],
            moneyPiles: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 10: 0}
        }
    },
    payment: {
        active: false,
        amount: 0,
        from: null,
        to: null
    }
};

// DOM elements container
const elements = {
    startButton: null,
    endTurnButton: null,
    drawPile: null,
    discardPile: null,
    playerHands: {},
    playerProperties: {},
    playerMoneyPiles: {},
    cardsRemaining: null,
    currentPlayerDisplay: null,
    gameStatus: null,
    centerStatus: null,
    gameHistory: null,
    paymentInfo: null
};

// Reset the game state
function resetGameState() {
    console.log('Resetting game state');
    
    // Clear properties of existing gameState object
    gameState.started = false;
    gameState.currentPlayer = 1;
    gameState.deck = [];
    gameState.discardPile = [];
    gameState.cardsPlayedThisTurn = 0;
    gameState.cardsDrawnThisTurn = 0;
    
    // Reset players
    gameState.players = {
        1: {
            hand: [],
            properties: [],
            moneyPiles: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 10: 0}
        },
        2: {
            hand: [],
            properties: [],
            moneyPiles: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 10: 0}
        }
    };
    
    // Reset payment info
    gameState.payment = {
        active: false,
        amount: 0,
        from: null,
        to: null
    };
    
    console.log('Game state reset successfully');
}

// Set up DOM elements references
function setupElements() {
    console.log('Setting up element references');
    
    elements.startButton = document.getElementById('start-game-btn');
    elements.endTurnButton = document.getElementById('end-turn-btn');
    elements.drawPile = document.getElementById('draw-pile');
    elements.discardPile = document.getElementById('discard-pile');
    elements.cardsRemaining = document.getElementById('cards-remaining');
    elements.currentPlayerDisplay = document.getElementById('current-player');
    elements.gameStatus = document.getElementById('game-status');
    elements.centerStatus = document.getElementById('center-status');
    elements.gameHistory = document.getElementById('game-history');
    elements.paymentInfo = document.getElementById('payment-info');
    
    // Player-specific elements
    elements.playerHands = {
        1: document.getElementById('player1-hand'),
        2: document.getElementById('player2-hand')
    };
    
    elements.playerProperties = {
        1: document.getElementById('player1-properties'),
        2: document.getElementById('player2-properties')
    };
    
    elements.playerMoneyPiles = {
        1: document.getElementById('player1-money-piles'),
        2: document.getElementById('player2-money-piles')
    };
    
    // Log if any elements are missing
    for (const [key, element] of Object.entries(elements)) {
        if (element === null) {
            console.error(`Element ${key} not found`);
        }
    }
    
    console.log('Element setup complete');
}

// Debug the game state
function debugGameState() {
    console.log('===== GAME STATE DEBUG =====');
    console.log('Game started:', gameState.started);
    console.log('Current player:', gameState.currentPlayer);
    console.log('Cards in deck:', gameState.deck.length);
    console.log('Cards in discard:', gameState.discardPile.length);
    console.log('Cards played this turn:', gameState.cardsPlayedThisTurn);
    console.log('Player 1 hand size:', gameState.players[1].hand ? gameState.players[1].hand.length : 'undefined');
    console.log('Player 2 hand size:', gameState.players[2].hand ? gameState.players[2].hand.length : 'undefined');
    console.log('Player 1 properties:', gameState.players[1].properties ? gameState.players[1].properties.length : 'undefined');
    console.log('Player 2 properties:', gameState.players[2].properties ? gameState.players[2].properties.length : 'undefined');
    console.log('========================');
}

// Check win condition
function checkWinCondition() {
    console.log('Checking win condition');
    
    for (let playerNumber = 1; playerNumber <= 2; playerNumber++) {
        // Count complete property sets
        const completeSets = countCompleteSets(playerNumber);
        console.log(`Player ${playerNumber} has ${completeSets} complete sets`);
        
        // Win condition: 3 complete property sets
        if (completeSets >= 3) {
            console.log(`Player ${playerNumber} has won the game!`);
            updateGameStatus(`Player ${playerNumber} has won the game with ${completeSets} complete property sets!`);
            
            // Disable further play
            gameState.gameStarted = false;
            
            if (elements.endTurnButton) elements.endTurnButton.disabled = true;
            if (elements.startButton) elements.startButton.textContent = 'Start New Game';
            
            return true;
        }
    }
    
    return false;
}

// Count complete property sets for a player
function countCompleteSets(playerNumber) {
    if (!gameState.players[playerNumber] || !gameState.players[playerNumber].properties) {
        return 0;
    }
    
    // Group properties by color
    const propertiesByColor = {};
    
    gameState.players[playerNumber].properties.forEach(property => {
        if (!property) return;
        
        const color = property.isWildcard ? property.assignedColor : property.color;
        if (!color) return;
        
        if (!propertiesByColor[color]) {
            propertiesByColor[color] = [];
        }
        
        propertiesByColor[color].push(property);
    });
    
    // Count complete sets
    let completeSets = 0;
    
    for (const [color, properties] of Object.entries(propertiesByColor)) {
        const requiredProperties = getRequiredPropertiesForColor(color);
        
        if (properties.length >= requiredProperties) {
            completeSets++;
        }
    }
    
    return completeSets;
}

// Get required number of properties for a complete set by color
function getRequiredPropertiesForColor(color) {
    switch (color) {
        case 'brown':
        case 'dark-blue':
            return 2;
        case 'light-blue':
        case 'pink':
        case 'orange':
        case 'red':
        case 'yellow':
        case 'green':
            return 3;
        case 'railroad':
            return 4;
        case 'utility':
            return 2;
        default:
            return Infinity; // Invalid color, impossible to complete
    }
}

// Start a new game
function startGame() {
    try {
        console.log('Starting game...');
        // Check if center status element exists
        if (!elements.centerStatus) {
            console.error('Center status element not found!');
            setupElements(); // Try to set up elements again
        }
        
        // Initialize the game state
        resetGameState();
        
        // Make sure we have a deck
        if (typeof initializeDeck !== 'function') {
            console.error('initializeDeck function is not defined!');
            return;
        }
        
        console.log('Initializing deck...');
        gameState.deck = initializeDeck();
        console.log(`Deck created with ${gameState.deck.length} cards`);
        
        // Shuffle the deck
        shuffleDeck();
        
        // Deal initial hand to players - 5 cards each
        for (let i = 0; i < 5; i++) {
            dealCard(1);
            dealCard(2);
        }
        
        // Update player hands UI
        updatePlayerHandUI(1);
        updatePlayerHandUI(2);
        
        // Set game state
        gameState.gameStarted = true;
        gameState.currentPlayer = 1;
        gameState.turnState = 'drawing';
        gameState.hasDrawnCards = false;
        gameState.cardsPlayedThisTurn = 0;
        
        // Update UI
        if (elements.startButton) elements.startButton.textContent = 'Restart Game';
        if (elements.endTurnButton) elements.endTurnButton.disabled = false;
        if (elements.currentPlayerDisplay) elements.currentPlayerDisplay.textContent = `Current Player: Player ${gameState.currentPlayer}`;
        
        // Update status messages with clear instructions
        updateGameStatus('Draw 2 cards to start your turn');
        
        // Explicitly update the center status with pulse animation
        console.log('Updating center status to indicate game started...');
        if (elements.centerStatus) {
            elements.centerStatus.textContent = 'Game started! Player 1\'s turn - Click on the Draw Pile to draw cards';
            elements.centerStatus.classList.add('pulse-animation');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                if (elements.centerStatus) {
                    elements.centerStatus.classList.remove('pulse-animation');
                }
            }, 600);
        } else {
            console.error('Center status element is null or undefined!');
        }
        
        // Add to history
        addToHistory('Game started! Each player has been dealt 5 cards.');
        
        // Update cards remaining
        updateCardsRemaining();
        
        // Debug the game state to help diagnose issues
        debugGameState();
        
        console.log('Game started successfully');
    } catch (error) {
        console.error('Error while starting game:', error);
    }
}

// Export objects and functions to make them accessible to other modules
window.gameState = gameState;
window.elements = elements;
window.resetGameState = resetGameState;
window.setupElements = setupElements;
window.debugGameState = debugGameState;
window.checkWinCondition = checkWinCondition;
window.countCompleteSets = countCompleteSets;
window.getRequiredPropertiesForColor = getRequiredPropertiesForColor;
window.startGame = startGame; 