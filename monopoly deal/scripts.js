// Game state
const gameState = {
    currentPlayer: 1, // 1 or 2
    players: {
        1: {
            hand: [],
            properties: [],
            money: [],
            moneyPiles: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                10: 0
            },
            totalMoney: 0
        },
        2: {
            hand: [],
            properties: [],
            money: [],
            moneyPiles: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                10: 0
            },
            totalMoney: 0
        }
    },
    deck: [],
    discardPile: [],
    cardsPlayedThisTurn: 0,
    gameStarted: false,
    selectedCard: null,
    actionInProgress: false,
    doubleRentActive: false,
    justSayNoInProgress: false,
    // Payment tracking
    paymentInProgress: false,
    paymentAmount: 0,
    paymentFrom: null,
    paymentTo: null,
    paymentControlEnabled: false,
    // Turn state tracking
    turnState: 'notStarted', // 'notStarted', 'needToDraw', 'canPlay', 'needToEndTurn'
    hasDrawnCards: false,
    waitingForPayment: false,
    cardsDrawnThisTurn: 0
};

// Keep track of which player perspective we're viewing (1 or 2)
let playerPerspective = 1;

// Function to get current player perspective
function getCurrentPlayerPerspective() {
    return playerPerspective;
}

// Card definitions
const cardDefinitions = {
    // Properties by color
    properties: {
        brown: [
            { id: 'brown1', name: 'Baltic Avenue', value: 1, rent: [1, 2] },
            { id: 'brown2', name: 'Mediterranean Avenue', value: 1, rent: [1, 2] }
        ],
        blue: [
            { id: 'blue1', name: 'Boardwalk', value: 4, rent: [3, 8] },
            { id: 'blue2', name: 'Park Place', value: 4, rent: [3, 8] }
        ],
        green: [
            { id: 'green1', name: 'Pacific Avenue', value: 4, rent: [2, 4, 7] },
            { id: 'green2', name: 'North Carolina Avenue', value: 4, rent: [2, 4, 7] },
            { id: 'green3', name: 'Pennsylvania Avenue', value: 4, rent: [2, 4, 7] }
        ],
        red: [
            { id: 'red1', name: 'Kentucky Avenue', value: 3, rent: [2, 3, 6] },
            { id: 'red2', name: 'Indiana Avenue', value: 3, rent: [2, 3, 6] },
            { id: 'red3', name: 'Illinois Avenue', value: 3, rent: [2, 3, 6] }
        ],
        yellow: [
            { id: 'yellow1', name: 'Ventnor Avenue', value: 3, rent: [2, 4, 6] },
            { id: 'yellow2', name: 'Marvin Gardens', value: 3, rent: [2, 4, 6] },
            { id: 'yellow3', name: 'Atlantic Avenue', value: 3, rent: [2, 4, 6] }
        ],
        orange: [
            { id: 'orange1', name: 'New York Avenue', value: 2, rent: [1, 3, 5] },
            { id: 'orange2', name: 'St. James Place', value: 2, rent: [1, 3, 5] },
            { id: 'orange3', name: 'Tennessee Avenue', value: 2, rent: [1, 3, 5] }
        ],
        purple: [
            { id: 'purple1', name: 'St. Charles Place', value: 2, rent: [1, 2, 4] },
            { id: 'purple2', name: 'Virginia Avenue', value: 2, rent: [1, 2, 4] },
            { id: 'purple3', name: 'States Avenue', value: 2, rent: [1, 2, 4] }
        ],
        lightblue: [
            { id: 'lightblue1', name: 'Connecticut Avenue', value: 1, rent: [1, 2, 3] },
            { id: 'lightblue2', name: 'Vermont Avenue', value: 1, rent: [1, 2, 3] },
            { id: 'lightblue3', name: 'Oriental Avenue', value: 1, rent: [1, 2, 3] }
        ],
        utility: [
            { id: 'utility1', name: 'Electric Company', value: 2, rent: [1, 2] },
            { id: 'utility2', name: 'Water Works', value: 2, rent: [1, 2] }
        ],
        railroad: [
            { id: 'railroad1', name: 'Reading Railroad', value: 2, rent: [1, 2, 3, 4] },
            { id: 'railroad2', name: 'Pennsylvania Railroad', value: 2, rent: [1, 2, 3, 4] },
            { id: 'railroad3', name: 'B. & O. Railroad', value: 2, rent: [1, 2, 3, 4] },
            { id: 'railroad4', name: 'Short Line', value: 2, rent: [1, 2, 3, 4] }
        ]
    },
    
    // Money cards
    money: [
        { id: 'money1', value: 1, count: 6 },
        { id: 'money2', value: 2, count: 5 },
        { id: 'money3', value: 3, count: 3 },
        { id: 'money4', value: 4, count: 3 },
        { id: 'money5', value: 5, count: 2 },
        { id: 'money10', value: 10, count: 1 }
    ],
    
    // Action cards
    actions: {
        rent: [
            { id: 'rent_any', color: 'any', value: 3, count: 3 },
            { id: 'rent_brown_lightblue', colors: ['brown', 'lightblue'], value: 1, count: 2 },
            { id: 'rent_orange_purple', colors: ['orange', 'purple'], value: 1, count: 2 },
            { id: 'rent_red_yellow', colors: ['red', 'yellow'], value: 1, count: 2 },
            { id: 'rent_blue_green', colors: ['blue', 'green'], value: 1, count: 2 },
            { id: 'rent_railroad_utility', colors: ['railroad', 'utility'], value: 1, count: 2 }
        ],
        dealBreaker: { id: 'deal_breaker', name: 'Deal Breaker', value: 5, count: 2 },
        justSayNo: { id: 'just_say_no', name: 'Just Say No', value: 4, count: 3 },
        slyDeal: { id: 'sly_deal', name: 'Sly Deal', value: 3, count: 3 },
        forcedDeal: { id: 'forced_deal', name: 'Forced Deal', value: 3, count: 3 },
        debtCollector: { id: 'debt_collector', name: 'Debt Collector', value: 3, count: 3 },
        itsMyBirthday: { id: 'birthday', name: "It's My Birthday", value: 2, count: 2 },
        passGo: { id: 'pass_go', name: 'Pass Go', value: 1, count: 10 },
        house: { id: 'house', name: 'House', value: 3, count: 2 },
        hotel: { id: 'hotel', name: 'Hotel', value: 4, count: 2 },
        doubleRent: { id: 'double_rent', name: 'Double The Rent', value: 1, count: 2 },
        wildcard: [
            { id: 'wild_any', name: 'Property Wild Card', colors: ['any'], value: 4, count: 2 },
            { id: 'wild_brown_lightblue', name: 'Brown/Light Blue', colors: ['brown', 'lightblue'], value: 1, count: 1 },
            { id: 'wild_orange_purple', name: 'Orange/Purple', colors: ['orange', 'purple'], value: 2, count: 1 },
            { id: 'wild_red_yellow', name: 'Red/Yellow', colors: ['red', 'yellow'], value: 3, count: 1 },
            { id: 'wild_blue_green', name: 'Blue/Green', colors: ['blue', 'green'], value: 4, count: 1 },
            { id: 'wild_railroad_utility', name: 'Railroad/Utility', colors: ['railroad', 'utility'], value: 2, count: 1 }
        ]
    }
};

// DOM References
const elements = {
    startButton: document.getElementById('start-game-btn'),
    endTurnButton: document.getElementById('end-turn-btn'),
    currentPlayerDisplay: document.getElementById('current-player'),
    gameStatus: document.getElementById('game-status'),
    centerStatus: document.getElementById('center-status'),
    playerHands: {
        1: document.getElementById('player1-hand'),
        2: document.getElementById('player2-hand')
    },
    playerProperties: {
        1: document.getElementById('player1-properties'),
        2: document.getElementById('player2-properties')
    },
    playerMoney: {
        1: document.getElementById('player1-money'),
        2: document.getElementById('player2-money')
    },
    playerMoneyPiles: {
        1: document.getElementById('player1-money-piles'),
        2: document.getElementById('player2-money-piles')
    },
    drawPile: document.getElementById('draw-pile'),
    discardPile: document.getElementById('discard-pile'),
    cardsRemaining: document.getElementById('cards-remaining'),
    cardActionModal: document.getElementById('card-action-modal'),
    cardActionOptions: document.getElementById('card-action-options'),
    cancelActionButton: document.getElementById('cancel-action-btn'),
    targetSelectionModal: document.getElementById('target-selection-modal'),
    targetOptions: document.getElementById('target-options'),
    cancelTargetButton: document.getElementById('cancel-target-btn'),
    gameHistory: document.getElementById('game-history'),
    // Payment tracking elements
    paymentInfo: document.getElementById('payment-info'),
    paymentAmount: document.getElementById('payment-amount'),
    paymentFrom: document.getElementById('payment-from'),
    paymentTo: document.getElementById('payment-to'),
    playerAreas: document.querySelectorAll('.player-area')
};

// Event Listeners
function setupEventListeners() {
    console.log('Setting up event listeners');
    
    try {
        // Start button
        const startButton = document.getElementById('start-game-btn');
        if (startButton) {
            startButton.onclick = function(event) {
                console.log('Start button clicked');
                startGame();
                if (event) event.preventDefault();
            };
            console.log('Start button event listener attached');
        } else {
            console.error('Start button element not found');
        }
        
        // End turn button
        const endTurnButton = document.getElementById('end-turn-btn');
        if (endTurnButton) {
            endTurnButton.onclick = function(event) {
                console.log('End turn button clicked');
                endTurn();
                if (event) event.preventDefault();
            };
            console.log('End turn button event listener attached');
        } else {
            console.error('End turn button element not found');
        }
        
        // Draw pile - use direct reference to avoid event bubbling issues
        const drawPile = document.getElementById('draw-pile');
        if (drawPile) {
            drawPile.onclick = function(event) {
                console.log('Draw pile clicked');
                drawCard();
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            };
            
            // Also attach to the card inside for better click detection
            const drawPileCard = drawPile.querySelector('.card');
            if (drawPileCard) {
                drawPileCard.onclick = function(event) {
                    console.log('Draw pile card clicked');
                    drawCard();
                    if (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                };
            }
            console.log('Draw pile event listeners attached');
        } else {
            console.error('Draw pile element not found');
        }
        
        // Money piles
        setupMoneyPileEventListeners();
        
        // Cancel action buttons
        const cancelActionBtn = document.getElementById('cancel-action-btn');
        if (cancelActionBtn) {
            cancelActionBtn.onclick = function() {
                console.log('Cancel action button clicked');
                cancelCardAction();
            };
        }
        
        // Cancel target button
        const cancelTargetBtn = document.getElementById('cancel-target-btn');
        if (cancelTargetBtn) {
            cancelTargetBtn.onclick = function() {
                console.log('Cancel target button clicked');
                cancelTargetSelection();
            };
        }
        
        console.log('All event listeners setup complete');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

function setupMoneyPileEventListeners() {
    try {
        // Player 1 money piles
        const player1Piles = document.querySelectorAll('#player1-money-piles .money-pile-card');
        player1Piles.forEach(pile => {
            pile.onclick = function() {
                const value = parseInt(pile.parentElement.getAttribute('data-value'));
                handleMoneyPileClick(1, value);
            };
        });
        
        // Player 2 money piles
        const player2Piles = document.querySelectorAll('#player2-money-piles .money-pile-card');
        player2Piles.forEach(pile => {
            pile.onclick = function() {
                const value = parseInt(pile.parentElement.getAttribute('data-value'));
                handleMoneyPileClick(2, value);
            };
        });
        
        console.log('Money pile event listeners set up');
    } catch (error) {
        console.error('Error setting up money pile listeners:', error);
    }
}

// Handle money pile click for payment
function handleMoneyPileClick(playerNumber, value) {
    // Only allow clicks when payment is in progress and this player needs to pay
    if (!gameState.paymentInProgress || gameState.paymentFrom !== playerNumber || !gameState.paymentControlEnabled) {
        return;
    }
    
    // Check if player has any money of this value
    if (gameState.players[playerNumber].moneyPiles[value] <= 0) {
        updateGameStatus(`You don't have any $${value}M bills to pay with`);
        return;
    }
    
    // Process payment
    gameState.players[playerNumber].moneyPiles[value]--;
    
    // Move money to recipient or discard
    if (gameState.paymentTo) {
        gameState.players[gameState.paymentTo].moneyPiles[value]++;
        updateMoneyPilesUI(gameState.paymentTo);
        addToHistory(`Player ${playerNumber} paid $${value}M to Player ${gameState.paymentTo}`, playerNumber);
    } else {
        addToHistory(`Player ${playerNumber} paid $${value}M to the bank`, playerNumber);
    }
    
    // Update UI for the player who paid
    updateMoneyPilesUI(playerNumber);
    
    // Update payment amount
    gameState.paymentAmount -= value;
    
    // Check if payment is complete
    if (gameState.paymentAmount <= 0) {
        completePayment();
    } else {
        // Update payment display
        elements.paymentAmount.textContent = `$${gameState.paymentAmount}M`;
        updateGameStatus(`Still need to pay $${gameState.paymentAmount}M`);
    }
}

// Complete payment process
function completePayment() {
    // Payment complete
    gameState.paymentInProgress = false;
    gameState.paymentAmount = 0;
    gameState.paymentControlEnabled = false;
    
    // Hide payment info
    elements.paymentInfo.classList.add('hidden');
    
    // Update game status
    updateGameStatus('Payment complete');
    
    // Add to history
    addToHistory(`Player ${gameState.paymentFrom} completed the payment`, gameState.paymentFrom);
    
    // Switch control back to the original player
    if (gameState.paymentFrom !== gameState.currentPlayer) {
        updateCenterStatus(`Returning to Player ${gameState.currentPlayer}'s turn`);
    }
    
    // Reset payment tracking
    const oldPaymentFrom = gameState.paymentFrom;
    gameState.paymentFrom = null;
    gameState.paymentTo = null;
    
    // Update UI to remove payment options highlighting
    updatePlayerHandUI(oldPaymentFrom);
    updatePlayerPropertiesUI(oldPaymentFrom);
}

// Add in player areas setup to ensure both players are properly visible
function setupPlayerAreas() {
    console.log('Setting up player areas');
    
    // Get references to the player areas
    const player1Area = document.getElementById('player1-area');
    const player2Area = document.getElementById('player2-area');
    
    if (!player1Area || !player2Area) {
        console.error('Player areas not found');
        return;
    }
    
    // Always show both player areas
    player1Area.classList.remove('hidden');
    player2Area.classList.remove('hidden');
    
    // Increase the property area size and reduce hand size
    const player1Properties = document.getElementById('player1-properties');
    const player2Properties = document.getElementById('player2-properties');
    const player1Hand = document.getElementById('player1-hand');
    const player2Hand = document.getElementById('player2-hand');
    
    if (player1Properties && player1Hand) {
        // Make property area larger
        player1Properties.style.height = 'calc(100% - 120px - 75px)';
        player1Properties.style.overflow = 'hidden';
        player1Properties.style.flexWrap = 'wrap';
        player1Properties.style.alignContent = 'flex-start';
        
        // Make hand more compact
        player1Hand.style.height = '120px'; 
        player1Hand.style.minHeight = '120px';
        player1Hand.style.flexWrap = 'wrap';
        player1Hand.style.overflow = 'hidden';
    }
    
    if (player2Properties && player2Hand) {
        // Make property area larger
        player2Properties.style.height = 'calc(100% - 120px - 75px)';
        player2Properties.style.overflow = 'hidden';
        player2Properties.style.flexWrap = 'wrap';
        player2Properties.style.alignContent = 'flex-start';
        
        // Make hand more compact
        player2Hand.style.height = '120px';
        player2Hand.style.minHeight = '120px';
        player2Hand.style.flexWrap = 'wrap';
        player2Hand.style.overflow = 'hidden';
    }
    
    // CRITICAL FIX: Remove ALL click handlers from player areas and hands that might interfere with card clicks
    const playerAreas = document.querySelectorAll('.player-area');
    playerAreas.forEach((area) => {
        // Remove any existing click handlers
        area.onclick = null;
        
        // Get all child elements that might have click handlers
        const handElement = area.querySelector('.player-hand');
        if (handElement) {
            // Remove any existing click handlers from the hand container
            handElement.onclick = null;
        }
    });
    
    console.log('Player areas setup complete - All click handlers cleared');
}

// Make a player's hand visible
function showPlayerHand(playerNumber) {
    console.log(`Showing Player ${playerNumber}'s hand`);
    
    // Get references to all player areas
    const playerAreas = document.querySelectorAll('.player-area');
    
    // Hide all player areas first
    playerAreas.forEach((area) => {
        area.classList.add('hidden');
    });
    
    // Show the selected player's area
    const selectedArea = document.getElementById(`player${playerNumber}-area`);
    if (selectedArea) {
        selectedArea.classList.remove('hidden');
        console.log(`Player ${playerNumber}'s hand is now visible`);
    } else {
        console.error(`Player ${playerNumber}'s area not found`);
    }
}

// Initialize the game on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded - initializing game');
    initGame();
    
    // Add the switch perspective button
    addSwitchPerspectiveButton();
    
    // Try to load saved game state
    loadGameState();
});

// Properly initialize the game
function initGame() {
    console.log('Initializing game');
    
    // Set up all element references
    setupElements();
    
    // Reset game state
    resetGameState();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set up player areas
    setupPlayerAreas();
    
    // Set default UI states
    if (elements.startButton) {
        elements.startButton.textContent = 'Start Game';
    }
    
    if (elements.endTurnButton) {
        elements.endTurnButton.disabled = true;
    }
    
    if (elements.currentPlayerDisplay) {
        elements.currentPlayerDisplay.textContent = 'Game not started';
    }
    
    if (elements.centerStatus) {
        elements.centerStatus.textContent = 'Click "Start New Game" to begin';
    }
    
    // Make draw pile visually distinct to encourage clicking
    if (elements.drawPile) {
        const drawPileCard = elements.drawPile.querySelector('.card');
        if (drawPileCard) {
            drawPileCard.style.boxShadow = '0 0 10px #4e73df';
        }
    }
    
    // Initialize money piles for both players
    initializeMoneyPiles(1);
    initializeMoneyPiles(2);
    
    // Initialize the deck
    gameState.deck = initializeDeck();
    
    // Update UI
    updateCardsRemaining();
    
    console.log('Game initialization complete');
}

// Initialize money piles for a player
function initializeMoneyPiles(playerNumber) {
    console.log(`Initializing money piles for Player ${playerNumber}`);
    
    const playerIndex = playerNumber - 1;
    
    // Ensure player exists
    if (!gameState.players || !gameState.players[playerIndex]) {
        console.error(`Player ${playerNumber} not found in game state`);
        return;
    }
    
    // Reset money piles
    gameState.players[playerIndex].moneyPiles = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        10: 0
    };
    
    // Reset total money
    gameState.players[playerIndex].totalMoney = 0;
    
    // Update UI
    updateMoneyPilesUI(playerNumber);
    
    console.log(`Money piles initialized for Player ${playerNumber}`);
}

// Start a new game
function startGame() {
    try {
        console.log('Starting game...');
        
        // Reset the player perspective to player 1
        playerPerspective = 1;
        
        // Reset game state first
        resetGameState();
        
        // Create and shuffle the deck
        gameState.deck = initializeDeck();
        console.log(`Deck created with ${gameState.deck.length} cards`);
        shuffleDeck();
        
        // Deal initial hand to players - 5 cards each
        for (let i = 0; i < 5; i++) {
            dealCard(1);
            dealCard(2);
        }
        
        // Set game state
        gameState.gameStarted = true;
        gameState.currentPlayer = 1;
        gameState.turnState = 'needToDraw';
        gameState.hasDrawnCards = false;
        gameState.cardsPlayedThisTurn = 0;
        gameState.cardsDrawnThisTurn = 0;
        
        // Update UI
        updatePlayerHandUI(1);
        updatePlayerHandUI(2);
        updateMoneyPilesUI(1);
        updateMoneyPilesUI(2);
        
        if (elements.startButton) elements.startButton.textContent = 'Restart Game';
        if (elements.endTurnButton) elements.endTurnButton.disabled = false;
        if (elements.currentPlayerDisplay) elements.currentPlayerDisplay.textContent = `Current Player: Player ${gameState.currentPlayer}`;
        
        // Update status
        updateGameStatus('Draw 2 cards to start your turn');
        updateCenterStatus('Game started! Player 1\'s turn - Click on the Draw Pile to draw cards');
        
        // Add pulse animation to draw pile
        if (elements.drawPile) {
            elements.drawPile.classList.add('pulse-animation');
            setTimeout(() => {
                elements.drawPile.classList.remove('pulse-animation');
            }, 1000);
        }
        
        // Add to history
        addToHistory('Game started! Each player has been dealt 5 cards.');
        
        // Update cards remaining
        updateCardsRemaining();
        
        // Update the switch perspective button (if it exists)
        const switchButton = document.getElementById('switch-perspective-btn');
        if (switchButton) {
            switchButton.textContent = `Switch to Player ${playerPerspective === 1 ? '2' : '1'}`;
        }
        
        // Ensure player areas are correctly displayed
        togglePlayerAreas();
        
        // Save the initial game state
        saveGameState();
        
        console.log('Game started successfully');
    } catch (error) {
        console.error('Error while starting game:', error);
        updateCenterStatus('Error starting game. Check console for details.');
    }
}

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

// Deal a card to a player
function dealCard(playerNumber) {
    console.log(`Dealing card to player ${playerNumber}`);
    
    // Check if we need to reshuffle
    if (gameState.deck.length === 0) {
        console.log('Reshuffling discard pile into draw pile');
        gameState.deck = [...gameState.discardPile];
        gameState.discardPile = [];
        shuffleDeck();
        elements.discardPile.innerHTML = '';
        addToHistory('Discard pile reshuffled into the draw pile.');
    }
    
    const card = gameState.deck.pop();
    
    // Ensure player and hand exist
    if (!gameState.players[playerNumber]) {
        console.error(`Player ${playerNumber} not found in game state`);
        return;
    }
    
    if (!Array.isArray(gameState.players[playerNumber].hand)) {
        console.error(`Player ${playerNumber} hand is not an array, initializing it`);
        gameState.players[playerNumber].hand = [];
    }
    
    gameState.players[playerNumber].hand.push(card);
    
    // Update cards remaining
    updateCardsRemaining();
    
    return card;
}

// Draw cards for the current player's turn
function drawCard() {
    console.log('Draw card called');
    
    // Check if game is started
    if (!gameState.gameStarted) {
        console.error('Cannot draw: Game not started');
        updateCenterStatus('Please start a new game first');
        return;
    }
    
    // Check if it's the current player's turn (modified to allow Player 2 to draw)
    if (gameState.currentPlayer !== getCurrentPlayerPerspective()) {
        console.error(`Cannot draw: Not your turn. Current player: ${gameState.currentPlayer}, Your perspective: ${getCurrentPlayerPerspective()}`);
        updateCenterStatus(`It's Player ${gameState.currentPlayer}'s turn`);
        return;
    }
    
    // Check if the player has already drawn their cards this turn
    if (gameState.cardsDrawnThisTurn >= 2) {
        console.error('Cannot draw: Already drawn maximum cards this turn');
        updateCenterStatus('You already drew your cards this turn');
        return;
    }
    
    // Draw a card
    dealCard(gameState.currentPlayer);
    gameState.cardsDrawnThisTurn++;
    
    // Update the UI
    updatePlayerHandUI(gameState.currentPlayer);
    updateCardsRemaining();
    
    // Add to history
    addToHistory(`Player ${gameState.currentPlayer} drew a card. Cards drawn this turn: ${gameState.cardsDrawnThisTurn}`, gameState.currentPlayer);
    
    // Update game state and UI based on number of cards drawn
    if (gameState.cardsDrawnThisTurn >= 2) {
        console.log("================ DRAW CARD DEBUG ================");
        console.log("Player has drawn 2 cards, setting hasDrawnCards to true");
        console.log(`Before: hasDrawnCards = ${gameState.hasDrawnCards}`);
        
        gameState.hasDrawnCards = true;
        gameState.turnState = 'canPlay';
        
        console.log(`After: hasDrawnCards = ${gameState.hasDrawnCards}`);
        console.log("=================================================");
        
        updateCenterStatus("You drew 2 cards. You can now play up to 3 cards.");
        
        // Enable the end turn button
        if (elements.endTurnButton) {
            elements.endTurnButton.disabled = false;
        }
    } else {
        updateCenterStatus(`Drew 1 card. Click draw pile again to draw your second card.`);
    }
    
    // Save game state to localStorage for multi-tab play
    saveGameState();
    
    console.log('Cards drawn successfully:', gameState.cardsDrawnThisTurn);
}

// End current player's turn
function endTurn() {
    console.log('End turn function triggered');
    
    if (!gameState.gameStarted) {
        updateGameStatus('Game not started yet.');
        addToHistory('Cannot end turn: Game not started yet');
        return;
    }
    
    // Check if player has drawn cards
    if (!gameState.hasDrawnCards) {
        updateGameStatus('You must draw cards before ending your turn!');
        addToHistory(`Player ${gameState.currentPlayer} tried to end turn without drawing cards`, gameState.currentPlayer);
        return;
    }
    
    // Ensure the player is ending their own turn from their perspective
    if (gameState.currentPlayer !== getCurrentPlayerPerspective()) {
        updateCenterStatus(`You cannot end Player ${gameState.currentPlayer}'s turn from Player ${getCurrentPlayerPerspective()}'s perspective`);
        return;
    }
    
    addToHistory(`Player ${gameState.currentPlayer} ended their turn`, gameState.currentPlayer);
    
    // Switch player
    const currentPlayer = gameState.currentPlayer;
    gameState.currentPlayer = currentPlayer === 1 ? 2 : 1;
    
    // Reset turn state
    gameState.turnState = 'needToDraw';
    gameState.hasDrawnCards = false;
    gameState.cardsPlayedThisTurn = 0;
    gameState.cardsDrawnThisTurn = 0;
    
    // Update UI
    elements.currentPlayerDisplay.textContent = `Current Player: Player ${gameState.currentPlayer}`;
    updateGameStatus(`Player ${gameState.currentPlayer}'s turn. Draw 2 cards to start.`);
    updateCenterStatus(`Player ${gameState.currentPlayer}'s turn - Click on the Draw Pile to draw cards`);
    
    // Update player areas visibility
    togglePlayerAreas();
    
    // Update both players' UI
    updatePlayerHandUI(1);
    updatePlayerHandUI(2);
    
    addToHistory(`Player ${currentPlayer} ended their turn. Now it's Player ${gameState.currentPlayer}'s turn.`, currentPlayer);
    console.log(`Turn ended. Now it's Player ${gameState.currentPlayer}'s turn`);
    
    // Save game state to localStorage for multi-tab play
    saveGameState();
    
    // If user isn't viewing the perspective of the current player, suggest switching
    if (gameState.currentPlayer !== getCurrentPlayerPerspective()) {
        updateCenterStatus(`It's now Player ${gameState.currentPlayer}'s turn. Consider switching perspective.`);
    }
}

// Check if any player has won (3 full property sets)
function checkWinCondition() {
    const player1Sets = countCompleteSets(1);
    const player2Sets = countCompleteSets(2);
    
    if (player1Sets >= 3) {
        elements.gameStatus.textContent = 'Game Over! Player 1 wins!';
        elements.centerStatus.textContent = 'Player 1 has collected 3 complete property sets!';
        addToHistory('Game Over! Player 1 wins with 3 complete property sets!');
        gameState.gameStarted = false;
        elements.endTurnButton.disabled = true;
    } else if (player2Sets >= 3) {
        elements.gameStatus.textContent = 'Game Over! Player 2 wins!';
        elements.centerStatus.textContent = 'Player 2 has collected 3 complete property sets!';
        addToHistory('Game Over! Player 2 wins with 3 complete property sets!');
        gameState.gameStarted = false;
        elements.endTurnButton.disabled = true;
    }
}

// Count complete property sets for a player
function countCompleteSets(playerNumber) {
    console.log(`Counting complete sets for Player ${playerNumber}`);
    
    const playerIndex = playerNumber - 1;
    
    // Ensure player and properties exist
    if (!gameState.players || !gameState.players[playerIndex]) {
        console.error(`Player ${playerNumber} not found in game state`);
        return 0;
    }
    
    // Safety check to ensure properties is an array
    if (!Array.isArray(gameState.players[playerIndex].properties)) {
        console.error(`Properties for Player ${playerNumber} is not an array. Initializing as empty array.`);
        gameState.players[playerIndex].properties = [];
        return 0;
    }
    
    const completedColors = new Set();
    
    // Group properties by color
    const propertiesByColor = {};
    
    gameState.players[playerIndex].properties.forEach(card => {
        if (card.type === 'property') {
            const color = card.isWildcard ? card.assignedColor : card.color;
            if (!color) return; // Skip unassigned wildcards
            
            if (!propertiesByColor[color]) {
                propertiesByColor[color] = [];
            }
            propertiesByColor[color].push(card);
        }
    });
    
    // Check which sets are complete
    Object.keys(propertiesByColor).forEach(color => {
        const requiredCards = cardDefinitions.properties[color] ? 
                              cardDefinitions.properties[color].length : 0;
        
        if (propertiesByColor[color].length >= requiredCards) {
            completedColors.add(color);
        }
    });
    
    return completedColors.size;
}

// Handle clicking on a card in the player's hand
function handleCardPlay(event) {
    console.log('handleCardPlay called with event:', event);
    
    try {
        // Debug info for our investigation
        console.log("======== HANDLE CARD PLAY ========");
        console.log(`Game started: ${gameState.gameStarted}`);
        console.log(`Current player: ${gameState.currentPlayer}`);
        console.log(`Player perspective: ${getCurrentPlayerPerspective()}`);
        console.log(`Has drawn cards: ${gameState.hasDrawnCards}`);
        console.log(`Cards played this turn: ${gameState.cardsPlayedThisTurn}`);
    
        if (!gameState.gameStarted) {
            console.log('Game not started yet');
            updateCenterStatus('Please start the game first');
            addToHistory('Cannot play card: Game not started', gameState.currentPlayer);
            return;
        }
        
        if (!gameState.hasDrawnCards) {
            console.log('Player has not drawn cards yet');
            updateCenterStatus('Draw your cards first');
            addToHistory('Cannot play card: Draw cards first', gameState.currentPlayer);
            return;
        }
        
        // CRITICAL FIX: Check player perspective
        if (gameState.currentPlayer !== getCurrentPlayerPerspective()) {
            console.log(`Not current player's turn. Current: ${gameState.currentPlayer}, Perspective: ${getCurrentPlayerPerspective()}`);
            updateCenterStatus(`It's not your turn. Current player: ${gameState.currentPlayer}`);
            addToHistory('Cannot play card: Not your turn', getCurrentPlayerPerspective());
            return;
        }
        
        // Get the element that was clicked
        const clickedElement = event.currentTarget || event.target;
        console.log('Clicked element:', clickedElement);
        
        // Check if the clicked element has a card index
        if (!clickedElement || !clickedElement.dataset || !clickedElement.dataset.cardIndex) {
            console.error('Card element does not have a card index');
            console.error('Clicked element:', clickedElement);
            console.error('Event target:', event.target);
            
            // Try to recover by looking for the closest card element with data-card-index
            const closestCard = clickedElement.closest('[data-card-index]');
            if (closestCard) {
                console.log('Found closest card element with index:', closestCard.dataset.cardIndex);
                if (closestCard.dataset.cardIndex) {
                    const recoveredIndex = parseInt(closestCard.dataset.cardIndex);
                    if (!isNaN(recoveredIndex)) {
                        console.log('Recovered card index:', recoveredIndex);
                        // Continue with the recovered index
                        playCardWithIndex(recoveredIndex);
                        return;
                    }
                }
            }
            updateCenterStatus('Error: Could not identify the card you clicked');
            return;
        }
        
        // Get the index of the card in the player's hand
        const cardIndex = parseInt(clickedElement.dataset.cardIndex);
        if (isNaN(cardIndex)) {
            console.error('Card index is not a number:', clickedElement.dataset.cardIndex);
            updateCenterStatus('Error: Invalid card selection');
            return;
        }
        
        // Debug info
        console.log(`Card index: ${cardIndex}`);
        console.log(`Current player: ${gameState.currentPlayer}`);
        console.log(`Current perspective: ${getCurrentPlayerPerspective()}`);
        console.log(`Cards played this turn: ${gameState.cardsPlayedThisTurn}`);
        
        // Play the card with the retrieved index
        playCardWithIndex(cardIndex);
    } catch (error) {
        console.error('Error in handleCardPlay:', error);
        updateCenterStatus('Error processing card play');
    }
}

// Helper function to play a card with the given index after validation
function playCardWithIndex(cardIndex) {
    // Ensure the player is playing from their perspective
    if (gameState.currentPlayer !== getCurrentPlayerPerspective()) {
        updateCenterStatus(`It's not your turn. Current player: ${gameState.currentPlayer}`);
        return;
    }
    
    // Check if maximum cards already played
    if (gameState.cardsPlayedThisTurn >= 3) {
        console.log('Maximum cards already played this turn');
        updateCenterStatus('You have already played 3 cards this turn');
        addToHistory('Cannot play more than 3 cards per turn', gameState.currentPlayer);
        return;
    }
    
    // Make sure the card index is valid and exists in the player's hand
    if (isNaN(cardIndex) || cardIndex < 0 || 
        !gameState.players[gameState.currentPlayer] || 
        !gameState.players[gameState.currentPlayer].hand || 
        cardIndex >= gameState.players[gameState.currentPlayer].hand.length) {
        console.error('Invalid card index:', cardIndex);
        addToHistory('Error: Invalid card selection', gameState.currentPlayer);
        return;
    }
    
    // Get the card
    const card = gameState.players[gameState.currentPlayer].hand[cardIndex];
    if (!card) {
        console.error('Card not found at index:', cardIndex);
        updateCenterStatus('Error: Card not found');
        return;
    }
    
    // Play the card
    console.log(`Playing card at index ${cardIndex}:`, card);
    
    // Show action options based on card type
    if (card.type === 'property') {
        // For property cards, offer to play as property or money
        showActionOptions(cardIndex, [
            { label: `Play as Property: ${card.name || card.color}`, action: 'property' },
            { label: `Play as Money: $${card.value}M`, action: 'money' }
        ]);
    } else if (card.type === 'money') {
        // Money cards just get played directly
        playMoneyCard(cardIndex);
    } else if (card.type === 'action') {
        // Action cards offer action or money options
        showActionOptions(cardIndex, [
            { label: `Play as Action: ${card.name || card.actionType}`, action: 'action' },
            { label: `Play as Money: $${card.value}M`, action: 'money' }
        ]);
    } else {
        // Default handling for unknown card types
        playCard(cardIndex);
    }
    
    // Save game state to localStorage for multi-tab play
    saveGameState();
}

// Function to show action options in a modal
function showActionOptions(cardIndex, options) {
    console.log(`Showing action options for card at index ${cardIndex}:`, options);
    
    const modalElement = document.getElementById('card-action-modal');
    const optionsContainer = document.getElementById('card-action-options');
    const cancelButton = document.getElementById('cancel-action-btn');
    
    if (!modalElement || !optionsContainer) {
        console.error('Card action modal elements not found');
        console.error('Modal element:', modalElement);
        console.error('Options container:', optionsContainer);
        updateCenterStatus('Error: Cannot show card actions');
        return;
    }
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Get the card
    const card = gameState.players[gameState.currentPlayer].hand[cardIndex];
    if (!card) {
        console.error('Card not found for options:', cardIndex);
        return;
    }
    
    console.log('Card for options:', card);
    
    // Add card info
    const cardInfo = document.createElement('div');
    cardInfo.className = 'modal-card-info';
    cardInfo.innerHTML = `
        <div class="modal-card-name">${card.name || card.type} Card</div>
        <div class="modal-card-description">${card.description || `Value: $${card.value}M`}</div>
    `;
    optionsContainer.appendChild(cardInfo);
    
    // Add option buttons
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'action-option-btn';
        button.textContent = option.label;
        button.onclick = function() {
            console.log(`Option selected: ${option.action}`);
            // Close the modal
            closeModal(modalElement);
            
            // Perform the action
            if (option.action === 'property') {
                playPropertyCard(cardIndex);
            } else if (option.action === 'money') {
                playCardAsMoney(cardIndex);
            } else if (option.action === 'action') {
                playActionCard(cardIndex);
            } else {
                // Default fallback
                playCard(cardIndex);
            }
            
            // Save game state to localStorage for multi-tab play
            if (typeof saveGameState === 'function') {
                saveGameState();
            }
        };
        optionsContainer.appendChild(button);
    });
    
    // Make sure the cancel button works
    if (cancelButton) {
        cancelButton.onclick = function() {
            console.log('Cancel button clicked');
            closeModal(modalElement);
        };
    } else {
        console.error('Cancel button not found in the modal');
        
        // Create a cancel button if it doesn't exist
        const newCancelButton = document.createElement('button');
        newCancelButton.className = 'cancel-action-btn';
        newCancelButton.textContent = 'Cancel';
        newCancelButton.onclick = function() {
            closeModal(modalElement);
        };
        optionsContainer.appendChild(newCancelButton);
    }
    
    // Show the modal
    modalElement.style.display = 'flex';
    console.log('Action options modal displayed');
}

// Update center status display (key action guidance)
function updateCenterStatus(message) {
    console.log('Updating center status:', message);
    if (elements.centerStatus) {
        elements.centerStatus.textContent = message;
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
}

// Update player hand UI
function updatePlayerHandUI(playerIndex) {
    console.log(`Updating player ${playerIndex} hand UI`);
    
    // Get player and hand element
    const player = gameState.players[playerIndex];
    const handElement = document.getElementById(`player${playerIndex}-hand`);
    
    if (!player) {
        console.error(`Player ${playerIndex} not found!`);
        return;
    }
    
    if (!handElement) {
        console.error(`Hand element for player ${playerIndex} not found!`);
        return;
    }
    
    // Clear existing card elements
    handElement.innerHTML = '';
    
    // Set hand styles to enable proper card wrapping
    handElement.style.display = 'flex';
    handElement.style.flexWrap = 'wrap';
    handElement.style.gap = '5px';
    handElement.style.padding = '5px';
    handElement.style.overflow = 'hidden';
    handElement.style.justifyContent = 'flex-start';
    handElement.style.alignItems = 'flex-start';
    handElement.style.alignContent = 'flex-start';
    
    // Check if hand array exists
    if (!Array.isArray(player.hand)) {
        console.error(`Player ${playerIndex} hand is not an array`);
        player.hand = []; // Initialize empty hand
        return;
    }
    
    // If this is the current player's perspective, show all cards in their hand
    if (playerIndex === getCurrentPlayerPerspective()) {
        console.log(`Showing ${player.hand.length} cards for player ${playerIndex}`);
        
        // Show cards with click handlers for your own hand
        player.hand.forEach((card, index) => {
            if (!card) {
                console.error(`Null card at index ${index} for player ${playerIndex}`);
                return;
            }
            
            // Get card object if it's an ID
            const cardObj = getCardById(card);
            if (!cardObj) {
                console.error(`Card at index ${index} could not be found`);
                return;
            }
            
            const cardElement = createCardElement(cardObj);
            
            // CRITICAL FIX: Ensure data attribute for card index is set correctly
            // Setting both ways for maximum compatibility
            cardElement.setAttribute('data-card-index', index);
            cardElement.dataset.cardIndex = index.toString();
            console.log(`Setting card index ${index} on element`, cardElement);
            
            // Style to make cards more compact
            cardElement.style.width = '80px';
            cardElement.style.height = '112px';
            cardElement.style.marginRight = '5px';
            cardElement.style.marginBottom = '5px';
            
            // BUGFIX: Simplified card playability logic
            // Cards are playable when:
            // 1. The current player matches the perspective (it's your turn)
            // 2. The player has drawn cards
            // 3. The player hasn't played 3 cards yet
            const isCurrentPlayersTurn = gameState.currentPlayer === getCurrentPlayerPerspective();
            const hasDrawnCards = gameState.hasDrawnCards;
            const hasNotPlayedMaxCards = gameState.cardsPlayedThisTurn < 3;
            
            // Simplified, clearer condition
            const isCardPlayable = isCurrentPlayersTurn && hasDrawnCards && hasNotPlayedMaxCards;
            
            // Debug the calculation
            console.log(`Card playability for index ${index}:`);
            console.log(`- Is current player's turn: ${isCurrentPlayersTurn} (currentPlayer: ${gameState.currentPlayer}, perspective: ${getCurrentPlayerPerspective()})`);
            console.log(`- Has drawn cards: ${hasDrawnCards}`);
            console.log(`- Has not played max cards: ${hasNotPlayedMaxCards} (played: ${gameState.cardsPlayedThisTurn})`);
            console.log(`- Final isCardPlayable: ${isCardPlayable}`);
            
            // Apply visual styling for playable cards
            if (isCardPlayable) {
                cardElement.style.cursor = 'pointer';
                cardElement.style.boxShadow = '0 0 10px yellow';
                cardElement.style.transform = 'translateY(-5px)';
            } else {
                cardElement.style.cursor = 'default';
                cardElement.style.opacity = '0.8';
            }
            
            // CRITICAL FIX: Add direct click handler to card element
            cardElement.onclick = function(event) {
                console.log("================ CARD CLICK DEBUG ================");
                console.log(`Card clicked at index ${index}`);
                console.log(`Game state started: ${gameState.gameStarted}`);
                console.log(`Current player: ${gameState.currentPlayer}`);
                console.log(`Player perspective: ${getCurrentPlayerPerspective()}`);
                console.log(`Has drawn cards: ${gameState.hasDrawnCards}`);
                console.log(`Cards played this turn: ${gameState.cardsPlayedThisTurn}`);
                console.log(`isCardPlayable: ${isCardPlayable}`);
                console.log(`Card element:`, this);
                console.log(`Card data-card-index:`, this.getAttribute('data-card-index'));
                console.log(`Card dataset.cardIndex:`, this.dataset.cardIndex);
                
                // Stop propagation to prevent parent handlers firing
                event.stopPropagation();
                
                // Only allow playing cards if it's playable
                if (isCardPlayable) {
                    console.log(`Playing card from hand index ${index}`);
                    
                    // CRITICAL FIX: Directly call playCardWithIndex with the index
                    // This bypasses the event.target handling in handleCardPlay
                    playCardWithIndex(index);
                } else {
                    console.log("Card not playable because:");
                    if (!gameState.hasDrawnCards) {
                        console.log("- Player has not drawn cards yet");
                        updateCenterStatus('You need to draw cards first before playing');
                    } else if (gameState.cardsPlayedThisTurn >= 3) {
                        console.log("- Already played 3 cards this turn");
                        updateCenterStatus('You already played 3 cards this turn');
                    } else if (gameState.currentPlayer !== getCurrentPlayerPerspective()) {
                        console.log(`- It's not your turn. Current player: ${gameState.currentPlayer}, Your perspective: ${getCurrentPlayerPerspective()}`);
                        updateCenterStatus('It\'s not your turn');
                    } else {
                        console.log("- Unknown reason");
                        updateCenterStatus('Cannot play this card right now');
                    }
                }
            };
            
            handElement.appendChild(cardElement);
        });
    } else {
        // For the opponent's hand, show face-down cards
        console.log(`Showing ${player.hand.length} face-down cards for opponent player ${playerIndex}`);
        
        // Create a counter to show how many cards in opponent's hand
        const counterElement = document.createElement('div');
        counterElement.className = 'card-counter';
        counterElement.textContent = `${player.hand.length} cards`;
        counterElement.style.position = 'absolute';
        counterElement.style.top = '5px';
        counterElement.style.right = '5px';
        counterElement.style.background = 'rgba(0,0,0,0.7)';
        counterElement.style.color = 'white';
        counterElement.style.padding = '2px 5px';
        counterElement.style.borderRadius = '3px';
        counterElement.style.fontSize = '14px';
        
        handElement.appendChild(counterElement);
        
        // Display face-down cards in a more compact way
        player.hand.forEach((cardId) => {
            const cardBack = document.createElement('div');
            cardBack.className = 'card card-back';
            
            // Style to make face-down cards more compact
            cardBack.style.width = '80px';
            cardBack.style.height = '112px';
            cardBack.style.backgroundColor = '#00008B';
            cardBack.style.border = '1px solid #000';
            cardBack.style.borderRadius = '5px';
            cardBack.style.marginRight = '5px';
            cardBack.style.marginBottom = '5px';
            
            handElement.appendChild(cardBack);
        });
    }
    
    console.log(`Player ${playerIndex} hand updated with ${player.hand.length} cards`);
}

// Update player properties UI
function updatePlayerPropertiesUI(playerNumber) {
    console.log(`Updating properties UI for player ${playerNumber}`);
    
    // Validate player number
    if (playerNumber !== 1 && playerNumber !== 2) {
        console.error(`Invalid player number: ${playerNumber}`);
        return;
    }
    
    // Get the player's properties element
    const propertiesElement = document.getElementById(`player${playerNumber}-properties`);
    if (!propertiesElement) {
        console.error(`Player ${playerNumber} properties element not found`);
        return;
    }
    
    // Clear the properties
    propertiesElement.innerHTML = '';
    
    // Check if we're viewing from this player's perspective
    const isOwnPerspective = (getCurrentPlayerPerspective() === playerNumber);
    
    // Safety check to ensure player and properties exist
    if (!gameState.players || !gameState.players[playerNumber] || !gameState.players[playerNumber].properties) {
        console.error(`Properties for Player ${playerNumber} not found. Initializing as empty array.`);
        if (gameState.players && gameState.players[playerNumber]) {
            gameState.players[playerNumber].properties = [];
        }
        return;
    }
    
    // Check if player has any properties
    const properties = gameState.players[playerNumber].properties;
    if (properties.length === 0) {
        const emptyText = document.createElement('div');
        emptyText.className = 'empty-properties';
        emptyText.textContent = 'No properties yet';
        emptyText.style.textAlign = 'center';
        emptyText.style.padding = '10px';
        emptyText.style.fontStyle = 'italic';
        emptyText.style.color = '#888';
        propertiesElement.appendChild(emptyText);
        console.log(`Player ${playerNumber} has no properties`);
        return;
    }
    
    // Display properties - always visible to both players (no hiding needed)
    // Properties should always be visible to both players since they're public information
    // Group properties by color
    const propertiesByColor = {};
    
    properties.forEach(property => {
        const color = property.isWildcard ? property.assignedColor || 'unassigned' : property.color;
        
        if (!color) {
            console.error('Property has no color:', property);
            return;
        }
        
        if (!propertiesByColor[color]) {
            propertiesByColor[color] = [];
        }
        
        propertiesByColor[color].push(property);
    });
    
    // Create property sets for each color
    for (const [color, colorProperties] of Object.entries(propertiesByColor)) {
        const propertySet = document.createElement('div');
        propertySet.className = 'property-set';
        
        // Check if this is a complete set
        const requiredCount = getRequiredPropertiesForColor(color);
        const isComplete = colorProperties.length >= requiredCount;
        
        if (isComplete) {
            propertySet.classList.add('complete');
        }
        
        // Add a color label
        const colorLabel = document.createElement('div');
        colorLabel.className = 'property-color-label property-' + color;
        colorLabel.textContent = formatColorName(color) + (isComplete ? ' ✓' : '');
        propertySet.appendChild(colorLabel);
        
        // Add all properties of this color
        colorProperties.forEach(property => {
            const propertyCard = createCardElement(property);
            propertySet.appendChild(propertyCard);
        });
        
        propertiesElement.appendChild(propertySet);
    }
    
    console.log(`Player ${playerNumber} properties updated with ${properties.length} properties`);
}

// Helper function to format color names for display
function formatColorName(color) {
    return color.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Play a card as money
function playCardAsMoney(cardIndex) {
    const currentPlayer = gameState.currentPlayer;
    const playerIndex = currentPlayer - 1;
    
    // Make sure the player exists
    if (!gameState.players[playerIndex]) {
        console.error(`Player ${currentPlayer} not found in game state`);
        return;
    }
    
    // Make sure the hand exists
    if (!gameState.players[playerIndex].hand) {
        console.error(`Hand for Player ${currentPlayer} not found`);
        return;
    }
    
    const card = gameState.players[playerIndex].hand[cardIndex];
    
    if (!card) {
        console.error(`No card found at index ${cardIndex}`);
        addToHistory(`Failed to play card as money: Card not found`, currentPlayer);
        return;
    }
    
    console.log(`Playing card as money: $${card.value}M`);
    
    // Remove card from hand
    const playedCard = gameState.players[playerIndex].hand.splice(cardIndex, 1)[0];
    
    // Add to appropriate money pile
    if (!gameState.players[playerIndex].moneyPiles[playedCard.value]) {
        gameState.players[playerIndex].moneyPiles[playedCard.value] = 0;
    }
    gameState.players[playerIndex].moneyPiles[playedCard.value]++;
    
    // Update game state
    gameState.cardsPlayedThisTurn++;
    
    // Update UI
    updatePlayerHandUI(currentPlayer);
    updateMoneyPilesUI(currentPlayer);
    
    // Update history
    addToHistory(`Player ${currentPlayer} added $${playedCard.value}M to their bank`, currentPlayer);
    
    // Update game status
    afterCardPlayed();
}

// Cancel the current card action
function cancelCardAction() {
    elements.cardActionModal.style.display = 'none';
    gameState.actionInProgress = false;
}

// Fix setupElements function to ensure all required elements are found
function setupElements() {
    console.log('Setting up UI elements...');
    
    // Game control elements
    elements.startButton = document.getElementById('start-game-btn');
    elements.endTurnButton = document.getElementById('end-turn-btn');
    elements.drawPile = document.getElementById('draw-pile');
    elements.centerStatus = document.getElementById('center-status');
    
    // Check that critical elements exist
    if (!elements.startButton) {
        console.error('Start button element not found!');
    } else {
        console.log('Start button found');
    }
    
    if (!elements.centerStatus) {
        console.error('Center status element not found!');
    } else {
        console.log('Center status element found');
    }
    
    if (!elements.drawPile) {
        console.error('Draw pile element not found!');
    } else {
        console.log('Draw pile element found');
    }
    
    // Player areas
    elements.player1Area = document.getElementById('player1-area');
    elements.player2Area = document.getElementById('player2-area');
    
    // Player hand and property areas
    elements.player1Hand = document.getElementById('player1-hand');
    elements.player2Hand = document.getElementById('player2-hand');
    elements.player1Properties = document.getElementById('player1-properties');
    elements.player2Properties = document.getElementById('player2-properties');
    
    // Money piles
    elements.player1MoneyPiles = document.getElementById('player1-money-piles');
    elements.player2MoneyPiles = document.getElementById('player2-money-piles');
    
    // Money counts
    elements.player1Money = document.getElementById('player1-money');
    elements.player2Money = document.getElementById('player2-money');
    
    // Game status displays
    elements.currentPlayerDisplay = document.getElementById('current-player');
    elements.gameStatus = document.getElementById('game-status');
    
    // Action modals
    elements.cardActionModal = document.getElementById('card-action-modal');
    elements.cardActionOptions = document.getElementById('card-action-options');
    elements.cancelActionButton = document.getElementById('cancel-action-btn');
    
    // Target selection modal
    elements.targetSelectionModal = document.getElementById('target-selection-modal');
    elements.targetOptions = document.getElementById('target-options');
    elements.cancelTargetButton = document.getElementById('cancel-target-btn');
    
    // Cards remaining display
    elements.cardsRemaining = document.getElementById('cards-remaining');
    
    // Game history area
    elements.gameHistory = document.getElementById('game-history');
    
    console.log('Element setup complete');
}

// Add a debugging function to track game state
function debugGameState() {
    console.log('---- GAME STATE DEBUG ----');
    console.log('Game Started:', gameState.gameStarted);
    console.log('Current Player:', gameState.currentPlayer);
    console.log('Turn State:', gameState.turnState);
    console.log('Has Drawn Cards:', gameState.hasDrawnCards);
    console.log('Cards Played This Turn:', gameState.cardsPlayedThisTurn);
    console.log('Player 1 Hand Size:', gameState.players[1]?.hand?.length || 0);
    console.log('Player 2 Hand Size:', gameState.players[2]?.hand?.length || 0);
    console.log('Cards Remaining in Deck:', gameState.deck?.length || 0);
    console.log('-------------------------');
}

// Add history function with improved logging
function addToHistory(message, playerNumber) {
    if (!elements.gameHistory) {
        console.error('Game history element not found');
        return;
    }
    
    console.log('History:', message);
    
    const historyEntry = document.createElement('div');
    historyEntry.className = 'history-entry';
    
    // Add player-specific class if playerNumber is provided
    if (playerNumber) {
        historyEntry.classList.add(`player${playerNumber}`);
    }
    
    // Add timestamp
    const timestamp = new Date();
    const timeStr = timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
    
    const timeElement = document.createElement('div');
    timeElement.className = 'history-time';
    timeElement.textContent = timeStr;
    historyEntry.appendChild(timeElement);
    
    // Add the main message
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    historyEntry.appendChild(messageElement);
    
    // Add to the top of the history (more recent events at the top)
    elements.gameHistory.insertBefore(historyEntry, elements.gameHistory.firstChild);
    
    // Limit history to 50 entries to prevent excessive scrolling
    while (elements.gameHistory.children.length > 50) {
        elements.gameHistory.removeChild(elements.gameHistory.lastChild);
    }
}

// A direct approach to start the game without relying on other functions
function directStartGame() {
    console.log('Direct start game function called!');
    
    try {
        // Set up basic game elements if not already done
        if (!elements) {
            window.elements = {};
            setupElements();
        }
        
        // Initialize game state if not already done
        if (!gameState) {
            window.gameState = {
                gameStarted: false,
                deck: [],
                players: {
                    1: { hand: [], properties: [], moneyPiles: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 10: 0}, totalMoney: 0 },
                    2: { hand: [], properties: [], moneyPiles: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 10: 0}, totalMoney: 0 }
                },
                currentPlayer: 1,
                hasDrawnCards: false,
                turnState: 'needToDraw',
                cardsPlayedThisTurn: 0
            };
        }
        
        // Call the real startGame function if it exists
        if (typeof startGame === 'function') {
            console.log('Calling regular startGame function');
            startGame();
        } else {
            // Use a minimal startGame implementation if the function doesn't exist
            console.error('startGame function not found, using backup implementation');
            
            // Initialize deck
            if (typeof initializeDeck === 'function') {
                initializeDeck();
            } else {
                console.error('initializeDeck function not found!');
            }
            
            // Set game state
            gameState.gameStarted = true;
            gameState.currentPlayer = 1;
            gameState.hasDrawnCards = false;
            gameState.turnState = 'needToDraw';
            gameState.cardsPlayedThisTurn = 0;
            
            // Deal initial cards (5 to each player)
            for (let i = 0; i < 5; i++) {
                for (let player = 1; player <= 2; player++) {
                    if (gameState.deck && gameState.deck.length > 0) {
                        const card = gameState.deck.pop();
                        gameState.players[player].hand.push(card);
                    }
                }
            }
            
            // Update UI
            if (typeof updatePlayerHandUI === 'function') {
                updatePlayerHandUI(1);
                updatePlayerHandUI(2);
            }
            
            // Update game status
            if (elements.centerStatus) {
                elements.centerStatus.textContent = 'GAME STARTED! Player 1: Draw your cards by clicking the draw pile';
                elements.centerStatus.classList.add('pulse-animation');
            }
            
            // Hide start button
            if (elements.startButton) {
                elements.startButton.style.display = 'none';
            }
            
            console.log('Backup game start completed');
        }
    } catch (error) {
        console.error('Error in directStartGame:', error);
        
        // Try to show an alert to the user
        if (elements && elements.centerStatus) {
            elements.centerStatus.textContent = 'Error starting game. Check console for details.';
            elements.centerStatus.classList.add('pulse-animation');
        } else {
            alert('Error starting game: ' + error.message);
        }
    }
}

// Add manual start button fix right at the beginning of the script
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired - setting up start button');
    
    // Direct binding with explicit onclick property
    const startButton = document.getElementById('start-game-btn');
    if (startButton) {
        console.log('Found start button in DOMContentLoaded event');
        
        startButton.onclick = function(event) {
            console.log('Start button clicked via onclick property');
            directStartGame();
            
            // Prevent default and stop propagation to be sure
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            return false;
        };
        
        // Also add a regular event listener as backup
        startButton.addEventListener('click', function(event) {
            console.log('Start button clicked via addEventListener');
            directStartGame();
            
            // Prevent default and stop propagation
            event.preventDefault();
            event.stopPropagation();
        });
        
        // Make the button visually distinct to confirm our code ran
        startButton.style.boxShadow = '0 0 10px #ff0000';
        startButton.style.position = 'relative';
        startButton.style.zIndex = '100';
        
        console.log('Start button handlers attached');
    } else {
        console.error('Start button not found in DOMContentLoaded event!');
        
        // Try again after a short delay
        setTimeout(function() {
            const retryStartButton = document.getElementById('start-game-btn');
            if (retryStartButton) {
                console.log('Found start button after delay');
                retryStartButton.onclick = directStartGame;
                retryStartButton.style.border = '2px solid red';
            } else {
                console.error('Start button still not found after delay');
            }
        }, 500);
    }
});

// Debug function to check page load status
function debugPageStatus() {
    console.log('====== PAGE STATUS DEBUG ======');
    console.log('Document readyState:', document.readyState);
    console.log('Start button exists:', document.getElementById('start-game-btn') !== null);
    console.log('Game container exists:', document.querySelector('.game-container') !== null);
    console.log('Current script status: Running debugPageStatus()');
    console.log('====== END STATUS DEBUG ======');
}

// Run this immediately
debugPageStatus();

// Also run it after the page is fully loaded
window.addEventListener('load', function() {
    console.log('Window load event fired');
    debugPageStatus();
    
    // One more attempt to fix the start button
    const startButton = document.getElementById('start-game-btn');
    if (startButton) {
        console.log('Found start button in window.load event');
        startButton.onclick = directStartGame;
        
        // Click the button programmatically once to test
        console.log('Simulating a click on the start button for testing');
        // Uncomment the line below to auto-start the game (for debugging)
        // startButton.click();
    }
});

// Update money piles UI
function updateMoneyPilesUI(playerNumber) {
    console.log(`Updating money piles UI for player ${playerNumber}`);
    
    // Get money piles container
    const moneyPilesContainer = document.getElementById(`player${playerNumber}-money-piles`);
    if (!moneyPilesContainer) {
        console.error(`Money piles container for Player ${playerNumber} not found`);
        return;
    }
    
    // Get money count element
    const moneyCountElement = document.getElementById(`player${playerNumber}-money`);
    if (!moneyCountElement) {
        console.error(`Money count element for Player ${playerNumber} not found`);
        return;
    }
    
    // Ensure player exists
    if (!gameState.players || !gameState.players[playerNumber]) {
        console.error(`Player ${playerNumber} not found in game state`);
        return;
    }
    
    // Ensure money piles exist
    if (!gameState.players[playerNumber].moneyPiles) {
        console.error(`Money piles for Player ${playerNumber} not found`);
        gameState.players[playerNumber].moneyPiles = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 10: 0};
    }
    
    // Calculate total money
    let totalMoney = 0;
    const moneyPiles = gameState.players[playerNumber].moneyPiles;
    
    for (const [value, count] of Object.entries(moneyPiles)) {
        // Update the count for each money pile
        const moneyPile = moneyPilesContainer.querySelector(`.money-pile[data-value="${value}"] .money-pile-count`);
        if (moneyPile) {
            moneyPile.textContent = count;
        }
        
        // Add to total
        totalMoney += parseInt(value) * count;
    }
    
    // Make money piles clickable for the current player
    const pileElements = moneyPilesContainer.querySelectorAll('.money-pile');
    pileElements.forEach(pileElement => {
        // Clear existing click handlers
        pileElement.onclick = null;
        
        // Highlight piles if this player is the current player and it's their turn
        const value = pileElement.dataset.value;
        const count = moneyPiles[value] || 0;
        
        if (playerNumber === gameState.currentPlayer && count > 0 && 
            playerNumber === getCurrentPlayerPerspective() && 
            gameState.payment && gameState.payment.active && 
            gameState.payment.from === playerNumber) {
            
            // Make this pile clickable for payment
            pileElement.classList.add('available-for-payment');
            pileElement.style.cursor = 'pointer';
            pileElement.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.7)';
            
            pileElement.onclick = () => handleMoneyPileClick(playerNumber, value);
        } else {
            // Not available for payment
            pileElement.classList.remove('available-for-payment');
            pileElement.style.cursor = 'default';
            pileElement.style.boxShadow = 'none';
        }
    });
    
    // Update the money count display
    moneyCountElement.textContent = `$${totalMoney}M`;
    
    // Store the total in the game state
    gameState.players[playerNumber].totalMoney = totalMoney;
    
    console.log(`Player ${playerNumber} money updated: $${totalMoney}M`);
}

function initializeDeck() {
    console.log('Initializing deck...');
    const deck = [];
    
    // Add property cards
    for (const color in cardDefinitions.properties) {
        cardDefinitions.properties[color].forEach(property => {
            deck.push({
                id: property.id,
                type: 'property',
                color: color,
                name: property.name,
                value: property.value,
                rent: property.rent
            });
        });
    }
    
    // Add money cards
    cardDefinitions.money.forEach(moneyCard => {
        for (let i = 0; i < moneyCard.count; i++) {
            deck.push({
                id: `${moneyCard.id}_${i}`,
                type: 'money',
                value: moneyCard.value
            });
        }
    });
    
    // Add action cards - rent cards
    cardDefinitions.actions.rent.forEach(rentCard => {
        for (let i = 0; i < rentCard.count; i++) {
            const card = {
                id: `${rentCard.id}_${i}`,
                type: 'action',
                actionType: 'rent',
                value: rentCard.value
            };
            
            if (rentCard.color) {
                card.color = rentCard.color;
            } else if (rentCard.colors) {
                card.colors = rentCard.colors;
            }
            
            deck.push(card);
        }
    });
    
    // Add other action cards
    const otherActions = [
        'dealBreaker', 'justSayNo', 'slyDeal', 'forcedDeal', 
        'debtCollector', 'itsMyBirthday', 'passGo', 'house', 
        'hotel', 'doubleRent'
    ];
    
    otherActions.forEach(actionType => {
        const actionCard = cardDefinitions.actions[actionType];
        if (actionCard) {
            for (let i = 0; i < actionCard.count; i++) {
                deck.push({
                    id: `${actionCard.id}_${i}`,
                    type: 'action',
                    actionType: actionType,
                    name: actionCard.name,
                    value: actionCard.value
                });
            }
        }
    });
    
    // Add wildcard property cards
    cardDefinitions.actions.wildcard.forEach(wildcard => {
        for (let i = 0; i < wildcard.count; i++) {
            deck.push({
                id: `${wildcard.id}_${i}`,
                type: 'property',
                isWildcard: true,
                colors: wildcard.colors,
                name: wildcard.name,
                value: wildcard.value
            });
        }
    });
    
    console.log(`Deck initialized with ${deck.length} cards`);
    
    // Shuffle the deck
    shuffleDeck(deck);
    
    return deck;
}

// Shuffle the deck (Fisher-Yates algorithm)
function shuffleDeck(deck) {
    console.log('Shuffling deck...');
    const deckToShuffle = deck || gameState.deck;
    
    for (let i = deckToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deckToShuffle[i], deckToShuffle[j]] = [deckToShuffle[j], deckToShuffle[i]];
    }
    
    console.log('Deck shuffled');
    return deckToShuffle;
}

// Helper function to get a card object by its ID
function getCardById(card) {
    // If card is already an object, return it directly
    if (typeof card === 'object') {
        return card;
    }
    
    // Otherwise, try to find card by ID in the deck and discard pile
    console.log('Looking for card with ID:', card);
    
    // Check the deck
    for (const deckCard of gameState.deck) {
        if (deckCard.id === card) {
            return deckCard;
        }
    }
    
    // Check the discard pile
    for (const discardCard of gameState.discardPile) {
        if (discardCard.id === card) {
            return discardCard;
        }
    }
    
    // Check player hands and properties
    for (let playerNum = 1; playerNum <= 2; playerNum++) {
        const player = gameState.players[playerNum];
        
        // Check hand
        for (const handCard of player.hand) {
            if (typeof handCard === 'object' && handCard.id === card) {
                return handCard;
            }
        }
        
        // Check properties
        for (const propCard of player.properties) {
            if (typeof propCard === 'object' && propCard.id === card) {
                return propCard;
            }
        }
    }
    
    console.error('Card with ID', card, 'not found');
    return null;
}

// Create a card element for the UI
function createCardElement(card) {
    if (!card) {
        console.error('Cannot create element for undefined card');
        // Create a placeholder for invalid card
        const errorCard = document.createElement('div');
        errorCard.className = 'card card-error';
        errorCard.textContent = 'Invalid Card';
        errorCard.style.backgroundColor = '#f44336';
        errorCard.style.color = 'white';
        errorCard.style.padding = '10px';
        errorCard.style.textAlign = 'center';
        return errorCard;
    }
    
    console.log('Creating card element for:', card);
    
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    
    // Add card inner container for content
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    // Add styling based on card type
    if (card.type === 'property') {
        cardElement.classList.add('property-card');
        // Set the color
        let backgroundColor = '#ddd'; // Default gray
        
        if (card.isWildcard) {
            // Handle wildcard properties
            if (card.colors && card.colors.includes('any')) {
                cardElement.classList.add('property-wild');
                backgroundColor = '#9c27b0'; // Purple for wildcards
            } else if (card.colors && card.colors.length > 1) {
                cardElement.classList.add('property-dual');
                const color1 = card.colors[0];
                const color2 = card.colors[1];
                cardElement.style.background = `linear-gradient(135deg, var(--${color1}-color, #ddd) 0%, var(--${color1}-color, #ddd) 50%, var(--${color2}-color, #ddd) 50%, var(--${color2}-color, #ddd) 100%)`;
                // Skip setting backgroundColor since we use gradient
                backgroundColor = null;
            } else {
                const assignedColor = card.assignedColor || (card.colors ? card.colors[0] : 'unassigned');
                cardElement.classList.add(`property-${assignedColor}`);
                backgroundColor = `var(--${assignedColor}-color, #ddd)`;
            }
        } else if (card.color) {
            cardElement.classList.add(`property-${card.color}`);
            backgroundColor = `var(--${card.color}-color, #ddd)`;
        }
        
        // Apply background color if not using gradient
        if (backgroundColor) {
            cardElement.style.backgroundColor = backgroundColor;
        }
        
        // Add card name
        const cardName = document.createElement('div');
        cardName.className = 'card-name';
        cardName.textContent = card.name || 'Property';
        cardInner.appendChild(cardName);
        
    } else if (card.type === 'money') {
        // Money card
        cardElement.classList.add('money-card');
        cardElement.classList.add(`money-${card.value}-card`);
        cardElement.style.backgroundColor = '#4caf50'; // Green for money
        
        // Add card name
        const cardName = document.createElement('div');
        cardName.className = 'card-name';
        cardName.innerHTML = `$${card.value}M`;
        cardName.style.fontSize = '18px';
        cardName.style.fontWeight = 'bold';
        cardInner.appendChild(cardName);
        
        // Add money symbol
        const moneySymbol = document.createElement('div');
        moneySymbol.className = 'money-symbol';
        moneySymbol.innerHTML = '$';
        moneySymbol.style.fontSize = '36px';
        moneySymbol.style.fontWeight = 'bold';
        moneySymbol.style.position = 'absolute';
        moneySymbol.style.top = '50%';
        moneySymbol.style.left = '50%';
        moneySymbol.style.transform = 'translate(-50%, -50%)';
        moneySymbol.style.opacity = '0.2';
        cardElement.appendChild(moneySymbol);
        
    } else if (card.type === 'action') {
        // Action card
        cardElement.classList.add('action-card');
        cardElement.style.backgroundColor = '#2196f3'; // Blue for action cards
        
        if (card.actionType === 'rent') {
            cardElement.classList.add('rent-card');
            // Add colors to rent card if specified
            if (card.colors) {
                const colorNames = card.colors.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join('/');
                // Style text only
                const colorLabel = document.createElement('div');
                colorLabel.textContent = colorNames;
                colorLabel.style.fontSize = '12px';
                colorLabel.style.fontWeight = 'bold';
                colorLabel.style.marginTop = '5px';
                cardInner.appendChild(colorLabel);
            }
        } else if (card.actionType === 'house') {
            cardElement.classList.add('house-card');
            cardElement.style.backgroundColor = '#8bc34a'; // Light green
        } else if (card.actionType === 'hotel') {
            cardElement.classList.add('hotel-card');
            cardElement.style.backgroundColor = '#f44336'; // Red
        } else if (card.actionType === 'passGo') {
            cardElement.classList.add('passgo-card');
            cardElement.style.backgroundColor = '#ff9800'; // Orange
        }
        
        // Add card name
        const cardName = document.createElement('div');
        cardName.className = 'card-name';
        
        // Make sure we have a readable name
        let cardTitle = '';
        if (card.name) {
            cardTitle = card.name;
        } else if (card.actionType) {
            // Format the action type name
            cardTitle = card.actionType
                .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
                .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
                
            // Special cases
            if (card.actionType === 'rent') {
                if (card.color === 'any') {
                    cardTitle = 'Rent (Any Color)';
                } else if (card.colors) {
                    const colorNames = card.colors.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join('/');
                    cardTitle = `Rent (${colorNames})`;
                }
            } else if (card.actionType === 'passGo') {
                cardTitle = 'Pass Go';
            }
        } else {
            cardTitle = 'Action Card';
        }
        
        cardName.textContent = cardTitle;
        cardInner.appendChild(cardName);
    }
    
    // Always ensure the card value is displayed
    if (card.value !== undefined) {
        const cardValue = document.createElement('div');
        cardValue.className = 'card-value';
        cardValue.textContent = `$${card.value}M`;
        cardValue.style.position = 'absolute';
        cardValue.style.top = '5px';
        cardValue.style.right = '5px';
        cardValue.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        cardValue.style.padding = '2px 5px';
        cardValue.style.borderRadius = '3px';
        cardValue.style.fontSize = '14px';
        cardValue.style.fontWeight = 'bold';
        cardElement.appendChild(cardValue);
    }
    
    // Add the inner container to the card
    cardElement.appendChild(cardInner);
    
    // Make sure the card has a reasonable minimum size
    cardElement.style.minWidth = '120px';
    cardElement.style.minHeight = '160px';
    cardElement.style.position = 'relative';
    cardElement.style.margin = '5px';
    cardElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    cardElement.style.borderRadius = '8px';
    cardElement.style.overflow = 'hidden';
    
    // Style the inner container
    cardInner.style.padding = '10px';
    cardInner.style.height = '100%';
    cardInner.style.display = 'flex';
    cardInner.style.flexDirection = 'column';
    cardInner.style.justifyContent = 'center';
    
    return cardElement;
}

// Update the cards remaining display
function updateCardsRemaining() {
    console.log('Updating cards remaining...');
    if (elements.cardsRemaining) {
        elements.cardsRemaining.textContent = gameState.deck.length;
        console.log(`Cards remaining: ${gameState.deck.length}`);
    } else {
        console.error('Cards remaining element not found');
    }
}

// Play a property card
function playPropertyCard(cardIndex) {
    console.log(`Playing property card at index ${cardIndex}`);
    
    const currentPlayer = gameState.currentPlayer;
    
    // Check if card index is valid
    if (!gameState.players[currentPlayer] || !gameState.players[currentPlayer].hand || cardIndex >= gameState.players[currentPlayer].hand.length) {
        console.error(`Invalid card index ${cardIndex} for player ${currentPlayer}`);
        return;
    }
    
    const card = gameState.players[currentPlayer].hand[cardIndex];
    
    console.log(`Playing property card: ${card.name || card.color}`);
    
    // Remove card from hand
    const playedCard = gameState.players[currentPlayer].hand.splice(cardIndex, 1)[0];
    
    // Ensure properties is an array
    if (!Array.isArray(gameState.players[currentPlayer].properties)) {
        console.error(`Properties for Player ${currentPlayer} is not an array. Initializing as empty array.`);
        gameState.players[currentPlayer].properties = [];
    }
    
    // Add to properties
    gameState.players[currentPlayer].properties.push(playedCard);
    
    // Update game state
    gameState.cardsPlayedThisTurn++;
    
    // Update UI
    updatePlayerHandUI(currentPlayer);
    updatePlayerPropertiesUI(currentPlayer);
    
    // Update history
    if (playedCard.isWildcard) {
        addToHistory(`Player ${currentPlayer} played a wildcard property: ${playedCard.name || 'Wild Card'}`, currentPlayer);
    } else {
        addToHistory(`Player ${currentPlayer} played a property: ${playedCard.name || playedCard.color}`, currentPlayer);
    }
    
    // Update game status
    afterCardPlayed();
    
    // Check win condition
    checkWinCondition();
    
    // Save game state
    if (typeof saveGameState === 'function') {
        saveGameState();
    }
}

// Toggle player areas visibility
function togglePlayerAreas() {
    console.log('Toggling player areas visibility');
    
    // Get player area elements
    const player1Area = document.getElementById('player1-area');
    const player2Area = document.getElementById('player2-area');
    
    if (!player1Area || !player2Area) {
        console.error('Player areas not found');
        return;
    }
    
    // Show current player's area, hide the other
    if (gameState.currentPlayer === 1) {
        player1Area.classList.remove('hidden');
        player2Area.classList.add('hidden');
        console.log('Player 1 area is now visible');
    } else {
        player1Area.classList.add('hidden');
        player2Area.classList.remove('hidden');
        console.log('Player 2 area is now visible');
    }
}

// Add this at the end of the file as a self-executing function
// This adds a direct click handler for the draw pile that runs immediately
(function() {
    console.log('Setting up direct draw pile click handler');
    setTimeout(function() {
        const drawPile = document.getElementById('draw-pile');
        if (drawPile) {
            console.log('Found draw pile, attaching direct click handler');
            
            // Make the draw pile visually distinct
            drawPile.style.border = '2px solid blue';
            drawPile.style.cursor = 'pointer';
            
            // Add a direct onclick handler
            drawPile.onclick = function(e) {
                console.log('DIRECT CLICK: Draw pile clicked');
                if (typeof drawCard === 'function') {
                    drawCard();
                } else {
                    console.error('drawCard function not available');
                    alert('Error: Draw card function not found');
                }
                
                // Prevent event bubbling
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            
            console.log('Direct draw pile handler attached successfully');
        } else {
            console.error('Could not find draw pile element for direct handler');
        }
    }, 500); // Small delay to ensure DOM is ready
})();

// Direct event listeners for critical game functions
function setupDirectEventListeners() {
    console.log('Setting up direct event listeners for critical game functions');
    
    // Set up direct draw pile click handler
    console.log('Setting up direct draw pile click handler');
    const drawPile = document.getElementById('draw-pile');
    if (drawPile) {
        drawPile.onclick = function(event) {
            console.log('DIRECT CLICK: Draw pile clicked');
            drawCard();
            event.preventDefault();
            event.stopPropagation();
        };
        console.log('Direct draw pile handler attached successfully');
    } else {
        console.error('Could not find draw pile element for direct handler!');
    }
    
    // Set up direct end turn button click handler
    console.log('Setting up direct end turn button click handler');
    const endTurnBtn = document.getElementById('end-turn-btn');
    if (endTurnBtn) {
        endTurnBtn.onclick = function(event) {
            console.log('DIRECT CLICK: End turn button clicked');
            endTurn();
            event.preventDefault();
            event.stopPropagation();
        };
        console.log('Direct end turn button handler attached successfully');
    } else {
        console.error('Could not find end turn button element for direct handler!');
    }
}

// Call this function early in the initialization process
document.addEventListener('DOMContentLoaded', function() {
    setupDirectEventListeners();
    console.log('Direct event listeners set up in DOMContentLoaded');
});

// Handle card action validation
function canPlayActionCard(card, currentPlayer) {
    // ... existing code ...
}

// Function to handle game state updates after a card is played
function afterCardPlayed() {
    console.log('Handling after-card-played state updates');
    
    // Check if maximum cards played
    if (gameState.cardsPlayedThisTurn >= 3) {
        updateGameStatus('You have played 3 cards this turn. End your turn.');
        updateCenterStatus('Maximum cards played. Click "End Turn" to finish your turn.');
    } else {
        const remainingCards = 3 - gameState.cardsPlayedThisTurn;
        updateGameStatus(`You can play ${remainingCards} more card${remainingCards !== 1 ? 's' : ''} this turn.`);
    }
    
    // Check for win condition
    checkWinCondition();
}

// Function to handle card play
function playCard(cardIndex) {
    const currentPlayer = gameState.currentPlayer;
    
    // Check if maximum cards already played
    if (gameState.cardsPlayedThisTurn >= 3) {
        updateCenterStatus('You have already played 3 cards this turn');
        addToHistory('Cannot play more than 3 cards per turn', currentPlayer);
        return;
    }
    
    // Get the card from player's hand
    const card = gameState.players[currentPlayer].hand[cardIndex];
    
    if (!card) {
        console.error('Card not found in player hand');
        return;
    }
    
    console.log(`Playing card: ${card.name || card.type}`, card);
    
    // Handle different card types
    if (card.type === 'property') {
        playPropertyCard(cardIndex);
    } else if (card.type === 'money') {
        playMoneyCard(cardIndex);
    } else if (card.type === 'action') {
        // Use our new action card handler that provides options in a modal
        playActionCard(cardIndex);
    } else {
        // Default case - play as money
        playCardAsMoney(cardIndex);
    }
    
    // Check win condition after playing a card
    checkWinCondition();
}

// Add the missing updateGameStatus function
function updateGameStatus(message) {
    console.log('Updating game status:', message);
    if (elements.gameStatus) {
        elements.gameStatus.textContent = message;
    } else {
        console.error('Game status element not found');
    }
}

// Function to switch player perspective
function switchPlayerPerspective() {
    playerPerspective = playerPerspective === 1 ? 2 : 1;
    updateGameUI();
    updateCenterStatus(`Switched to Player ${playerPerspective}'s perspective`);
    return playerPerspective;
}

// Add a button to switch perspectives in the UI
function addSwitchPerspectiveButton() {
    const gameHeader = document.querySelector('.game-header');
    if (!gameHeader) return;
    
    // Check if button already exists
    if (document.getElementById('switch-perspective-btn')) {
        return;
    }
    
    // Create switch perspective button
    const switchButton = document.createElement('button');
    switchButton.id = 'switch-perspective-btn';
    switchButton.textContent = `Switch to Player ${playerPerspective === 1 ? '2' : '1'}`;
    switchButton.style.marginLeft = '10px';
    
    // Add click event
    switchButton.onclick = function() {
        switchPlayerPerspective();
        // Update button text
        this.textContent = `Switch to Player ${playerPerspective === 1 ? '2' : '1'}`;
        
        // Save game state to sync between tabs
        saveGameState();
    };
    
    // Add to game header after the current player display
    gameHeader.appendChild(switchButton);
    console.log('Switch perspective button added');
}

// Update the game UI based on current perspective
function updateGameUI() {
    console.log(`Updating game UI for player ${playerPerspective}'s perspective`);
    
    // Show the current player's area based on perspective
    showPlayerAreasBasedOnPerspective();
    
    // Update both players' hand UI
    updatePlayerHandUI(1);
    updatePlayerHandUI(2);
    
    // Update both players' properties UI
    updatePlayerPropertiesUI(1);
    updatePlayerPropertiesUI(2);
}

// Function to show player areas based on the current perspective
function showPlayerAreasBasedOnPerspective() {
    console.log('Showing player areas based on perspective');
    
    // Get player area elements
    const player1Area = document.getElementById('player1-area');
    const player2Area = document.getElementById('player2-area');
    
    if (!player1Area || !player2Area) {
        console.error('Player areas not found');
        return;
    }
    
    // Always show both areas (we'll show opponent cards face down instead of hiding the area)
    player1Area.classList.remove('hidden');
    player2Area.classList.remove('hidden');
    
    // Update player hands to show cards based on perspective
    updatePlayerHandUI(1);
    updatePlayerHandUI(2);
    
    // Update properties UI to show based on perspective
    updatePlayerPropertiesUI(1);
    updatePlayerPropertiesUI(2);
    
    // Update money piles
    updateMoneyPilesUI(1);
    updateMoneyPilesUI(2);
    
    console.log('Player areas updated based on perspective:', getCurrentPlayerPerspective());
}

// Toggle player areas visibility - Modified to use perspective
function togglePlayerAreas() {
    console.log('Toggling player areas visibility');
    showPlayerAreasBasedOnPerspective();
}

// Save game state to localStorage
function saveGameState() {
    try {
        const state = {
            gameState: gameState,
            playerPerspective: playerPerspective
        };
        localStorage.setItem('monopolyDealGameState', JSON.stringify(state));
        console.log('Game state saved to localStorage');
    } catch (error) {
        console.error('Error saving game state to localStorage:', error);
    }
}

// Load game state from localStorage
function loadGameState() {
    try {
        const savedState = localStorage.getItem('monopolyDealGameState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            
            // Update our game state with saved values
            if (parsedState.gameState) {
                Object.assign(gameState, parsedState.gameState);
            }
            
            // Update player perspective
            if (parsedState.playerPerspective) {
                playerPerspective = parsedState.playerPerspective;
            }
            
            console.log('Game state loaded from localStorage');
            
            // Update UI to reflect loaded state
            updateGameUI();
            updateCardsRemaining();
            
            // Update the switch perspective button
            const switchButton = document.getElementById('switch-perspective-btn');
            if (switchButton) {
                switchButton.textContent = `Switch to Player ${playerPerspective === 1 ? '2' : '1'}`;
            }
        }
    } catch (error) {
        console.error('Error loading game state from localStorage:', error);
    }
}

// Add this function to handle action cards properly
function playActionCard(cardIndex) {
    console.log(`Playing action card at index ${cardIndex}`);
    const currentPlayer = gameState.currentPlayer;
    const card = gameState.players[currentPlayer].hand[cardIndex];
    
    if (!card || card.type !== 'action') {
        console.error('Invalid action card');
        return;
    }
    
    console.log('Action card to play:', card);
    
    // Get the action type from the card
    const actionType = card.action || 'generic';
    
    // Create options based on the type of action card
    let options = [];
    
    // Based on the Monopoly Deal rules we found
    switch (actionType) {
        case 'pass-go':
            options = [
                { 
                    label: `Play as Action: ${card.name} - Draw 2 cards`, 
                    action: 'action',
                    handler: function() {
                        // Remove the card from hand
                        const playedCard = gameState.players[currentPlayer].hand.splice(cardIndex, 1)[0];
                        
                        // Add to discard pile
                        gameState.discardPile.push(playedCard);
                        
                        // Draw 2 cards for the Pass Go action
                        dealCard(currentPlayer);
                        dealCard(currentPlayer);
                        
                        // Update game state
                        gameState.cardsPlayedThisTurn++;
                        updatePlayerHandUI(currentPlayer);
                        
                        // Add to history
                        addToHistory(`Player ${currentPlayer} played Pass Go and drew 2 cards`, currentPlayer);
                    }
                },
                { 
                    label: `Play as Money: $${card.value}M`,
                    action: 'money'
                }
            ];
            break;
            
        case 'rent':
            // Rent cards let you charge rent based on properties you own
            options = [
                { 
                    label: `Play as Rent: ${card.description || 'Charge rent'}`, 
                    action: 'action',
                    handler: function() {
                        // Remove the card from hand
                        const playedCard = gameState.players[currentPlayer].hand.splice(cardIndex, 1)[0];
                        
                        // Add to discard pile
                        gameState.discardPile.push(playedCard);
                        
                        // Update game state
                        gameState.cardsPlayedThisTurn++;
                        updatePlayerHandUI(currentPlayer);
                        
                        // Add to history
                        addToHistory(`Player ${currentPlayer} played a Rent card: ${card.description || 'Charge rent'}`, currentPlayer);
                        
                        // In a real implementation, we would now show a target selection for who to charge rent to
                    }
                },
                { 
                    label: `Play as Money: $${card.value}M`,
                    action: 'money'
                }
            ];
            break;
            
        default:
            // Default handling for other action cards
            options = [
                { 
                    label: `Play as Action: ${card.name || actionType}`, 
                    action: 'action'
                },
                { 
                    label: `Play as Money: $${card.value}M`,
                    action: 'money'
                }
            ];
    }
    
    // Use the showActionOptions function to display the modal
    showActionOptions(cardIndex, options);
}

// Helper function to close modal
function closeModal(modalElement) {
    console.log('Closing modal:', modalElement);
    
    if (!modalElement) {
        console.error('Cannot close modal: Modal element is null or undefined');
        return;
    }
    
    try {
        // Hide the modal
        modalElement.style.display = 'none';
        console.log('Modal closed successfully');
    } catch (error) {
        console.error('Error closing modal:', error);
    }
}