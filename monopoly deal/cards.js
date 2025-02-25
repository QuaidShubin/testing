// Card functions for Monopoly Deal

// Initialize the deck of cards
function initializeDeck() {
    console.log('Initializing deck...');
    const deck = [];
    
    // Money/Action cards
    // Pass Go (Draw 2 cards) - 10 cards
    for (let i = 0; i < 10; i++) {
        deck.push({
            type: 'action',
            action: 'pass-go',
            name: 'Pass Go',
            description: 'Draw 2 cards',
            value: 1
        });
    }
    
    // Rent cards - 2x for each color (12 total)
    const colors = ['brown/light-blue', 'orange/pink', 'red/yellow', 'green/dark-blue', 'railroad/utility', 'any-color'];
    for (const color of colors) {
        for (let i = 0; i < 2; i++) {
            const value = color === 'any-color' ? 3 : (color === 'railroad/utility' ? 1 : 2);
            deck.push({
                type: 'action',
                action: 'rent',
                name: 'Rent',
                description: `Charge rent for ${color} properties`,
                color: color,
                value: value
            });
        }
    }
    
    // Money cards
    // $1M - 6 cards
    for (let i = 0; i < 6; i++) {
        deck.push({
            type: 'money',
            value: 1,
            name: '$1M'
        });
    }
    
    // $2M - 5 cards
    for (let i = 0; i < 5; i++) {
        deck.push({
            type: 'money',
            value: 2,
            name: '$2M'
        });
    }
    
    // $3M - 3 cards
    for (let i = 0; i < 3; i++) {
        deck.push({
            type: 'money',
            value: 3,
            name: '$3M'
        });
    }
    
    // $4M - 3 cards
    for (let i = 0; i < 3; i++) {
        deck.push({
            type: 'money',
            value: 4,
            name: '$4M'
        });
    }
    
    // $5M - 2 cards
    for (let i = 0; i < 2; i++) {
        deck.push({
            type: 'money',
            value: 5,
            name: '$5M'
        });
    }
    
    // $10M - 1 card
    deck.push({
        type: 'money',
        value: 10,
        name: '$10M'
    });
    
    // Property cards
    // Brown
    deck.push({
        type: 'property',
        color: 'brown',
        name: 'Baltic Avenue',
        value: 1
    });
    
    deck.push({
        type: 'property',
        color: 'brown',
        name: 'Mediterranean Avenue',
        value: 1
    });
    
    // Light Blue
    deck.push({
        type: 'property',
        color: 'light-blue',
        name: 'Connecticut Avenue',
        value: 1
    });
    
    deck.push({
        type: 'property',
        color: 'light-blue',
        name: 'Vermont Avenue',
        value: 1
    });
    
    deck.push({
        type: 'property',
        color: 'light-blue',
        name: 'Oriental Avenue',
        value: 1
    });
    
    // Pink
    deck.push({
        type: 'property',
        color: 'pink',
        name: 'St. Charles Place',
        value: 2
    });
    
    deck.push({
        type: 'property',
        color: 'pink',
        name: 'Virginia Avenue',
        value: 2
    });
    
    deck.push({
        type: 'property',
        color: 'pink',
        name: 'States Avenue',
        value: 2
    });
    
    // Orange
    deck.push({
        type: 'property',
        color: 'orange',
        name: 'St. James Place',
        value: 2
    });
    
    deck.push({
        type: 'property',
        color: 'orange',
        name: 'Tennessee Avenue',
        value: 2
    });
    
    deck.push({
        type: 'property',
        color: 'orange',
        name: 'New York Avenue',
        value: 2
    });
    
    // Red
    deck.push({
        type: 'property',
        color: 'red',
        name: 'Kentucky Avenue',
        value: 3
    });
    
    deck.push({
        type: 'property',
        color: 'red',
        name: 'Indiana Avenue',
        value: 3
    });
    
    deck.push({
        type: 'property',
        color: 'red',
        name: 'Illinois Avenue',
        value: 3
    });
    
    // Yellow
    deck.push({
        type: 'property',
        color: 'yellow',
        name: 'Ventnor Avenue',
        value: 3
    });
    
    deck.push({
        type: 'property',
        color: 'yellow',
        name: 'Marvin Gardens',
        value: 3
    });
    
    deck.push({
        type: 'property',
        color: 'yellow',
        name: 'Atlantic Avenue',
        value: 3
    });
    
    // Green
    deck.push({
        type: 'property',
        color: 'green',
        name: 'Pacific Avenue',
        value: 4
    });
    
    deck.push({
        type: 'property',
        color: 'green',
        name: 'North Carolina Avenue',
        value: 4
    });
    
    deck.push({
        type: 'property',
        color: 'green',
        name: 'Pennsylvania Avenue',
        value: 4
    });
    
    // Dark Blue
    deck.push({
        type: 'property',
        color: 'dark-blue',
        name: 'Park Place',
        value: 4
    });
    
    deck.push({
        type: 'property',
        color: 'dark-blue',
        name: 'Boardwalk',
        value: 4
    });
    
    // Railroads
    deck.push({
        type: 'property',
        color: 'railroad',
        name: 'Reading Railroad',
        value: 2
    });
    
    deck.push({
        type: 'property',
        color: 'railroad',
        name: 'Pennsylvania Railroad',
        value: 2
    });
    
    deck.push({
        type: 'property',
        color: 'railroad',
        name: 'B&O Railroad',
        value: 2
    });
    
    deck.push({
        type: 'property',
        color: 'railroad',
        name: 'Short Line',
        value: 2
    });
    
    // Utilities
    deck.push({
        type: 'property',
        color: 'utility',
        name: 'Electric Company',
        value: 2
    });
    
    deck.push({
        type: 'property',
        color: 'utility',
        name: 'Water Works',
        value: 2
    });
    
    // Wildcards
    // Multi-color wildcards (any color but not railroad/utility)
    for (let i = 0; i < 2; i++) {
        deck.push({
            type: 'property',
            isWildcard: true,
            validColors: ['brown', 'light-blue', 'pink', 'orange', 'red', 'yellow', 'green', 'dark-blue'],
            name: 'Any Color Wildcard',
            value: 4,
            assignedColor: null
        });
    }
    
    // Dual-color wildcards
    const dualColorWildcards = [
        ['brown', 'light-blue'],
        ['pink', 'orange'],
        ['red', 'yellow'],
        ['green', 'dark-blue'],
        ['railroad', 'utility']
    ];
    
    for (const [color1, color2] of dualColorWildcards) {
        for (let i = 0; i < 1; i++) {
            deck.push({
                type: 'property',
                isWildcard: true,
                validColors: [color1, color2],
                name: `${color1}/${color2} Wildcard`,
                value: 3,
                assignedColor: null
            });
        }
    }
    
    // Other action cards
    // Deal Breaker
    for (let i = 0; i < 2; i++) {
        deck.push({
            type: 'action',
            action: 'deal-breaker',
            name: 'Deal Breaker',
            description: 'Steal a complete set from any player',
            value: 5
        });
    }
    
    // Forced Deal
    for (let i = 0; i < 3; i++) {
        deck.push({
            type: 'action',
            action: 'forced-deal',
            name: 'Forced Deal',
            description: 'Swap a property with another player',
            value: 3
        });
    }
    
    // Just Say No
    for (let i = 0; i < 3; i++) {
        deck.push({
            type: 'action',
            action: 'just-say-no',
            name: 'Just Say No',
            description: 'Cancel an action against you',
            value: 4
        });
    }
    
    // Birthday
    for (let i = 0; i < 2; i++) {
        deck.push({
            type: 'action',
            action: 'birthday',
            name: 'It\'s My Birthday',
            description: 'Each player gives you $2M',
            value: 2
        });
    }
    
    // Debt Collector
    for (let i = 0; i < 3; i++) {
        deck.push({
            type: 'action',
            action: 'debt-collector',
            name: 'Debt Collector',
            description: 'Collect $5M from any player',
            value: 3
        });
    }
    
    // Sly Deal
    for (let i = 0; i < 3; i++) {
        deck.push({
            type: 'action',
            action: 'sly-deal',
            name: 'Sly Deal',
            description: 'Steal a property from any player',
            value: 3
        });
    }
    
    // House/Hotel
    // Houses
    for (let i = 0; i < 2; i++) {
        deck.push({
            type: 'action',
            action: 'house',
            name: 'House',
            description: 'Add to a full set to add $3M to rent',
            value: 3
        });
    }
    
    // Hotels
    for (let i = 0; i < 2; i++) {
        deck.push({
            type: 'action',
            action: 'hotel',
            name: 'Hotel',
            description: 'Add to a set with a house to add $4M to rent',
            value: 4
        });
    }
    
    console.log(`Created deck with ${deck.length} cards`);
    return deck;
}

// Shuffle the deck
function shuffleDeck() {
    console.log('Shuffling deck...');
    
    for (let i = gameState.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
    }
    
    console.log('Deck shuffled');
}

// Create a card element for display
function createCardElement(card) {
    if (!card) {
        console.error('Attempted to create element for undefined card');
        const errorCard = document.createElement('div');
        errorCard.className = 'card error-card';
        errorCard.textContent = 'Error Card';
        return errorCard;
    }
    
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    
    // Add specific class based on card type
    if (card.type === 'property') {
        cardElement.classList.add('property-card');
        if (card.color) {
            cardElement.classList.add(`${card.color}-card`);
        }
        if (card.isWildcard) {
            cardElement.classList.add('wildcard');
        }
    } else if (card.type === 'money') {
        cardElement.classList.add('money-card');
        cardElement.classList.add(`money-${card.value}`);
    } else if (card.type === 'action') {
        cardElement.classList.add('action-card');
        cardElement.classList.add(`action-${card.action}`);
    }
    
    // Inner content
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    // Card title
    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = card.name || `${card.type} Card`;
    cardInner.appendChild(title);
    
    // Card value
    const value = document.createElement('div');
    value.className = 'card-value';
    value.textContent = card.value ? `$${card.value}M` : '';
    cardInner.appendChild(value);
    
    // Card description or properties
    if (card.description) {
        const description = document.createElement('div');
        description.className = 'card-description';
        description.textContent = card.description;
        cardInner.appendChild(description);
    } else if (card.color) {
        const property = document.createElement('div');
        property.className = 'card-property';
        property.textContent = card.isWildcard ? 'Wildcard' : card.color;
        cardInner.appendChild(property);
    }
    
    cardElement.appendChild(cardInner);
    return cardElement;
}

// Update cards remaining counter
function updateCardsRemaining() {
    if (elements.cardsRemaining) {
        elements.cardsRemaining.textContent = gameState.deck.length;
        
        // Style changes based on remaining cards
        if (gameState.deck.length < 10) {
            elements.cardsRemaining.classList.add('low-cards');
        } else {
            elements.cardsRemaining.classList.remove('low-cards');
        }
    } else {
        console.error('Cards remaining element not found');
    }
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
    if (!gameState || !gameState.gameStarted) {
        console.error('Cannot draw: Game not started');
        updateCenterStatus('Please start a new game first');
        return;
    }
    
    // Check if it's player 1's turn (the human player)
    if (gameState.currentPlayer !== 1) {
        console.error('Cannot draw: Not your turn');
        updateCenterStatus(`It's Player ${gameState.currentPlayer}'s turn`);
        return;
    }
    
    // Check if already drawn maximum cards
    if (gameState.cardsDrawnThisTurn >= 2) {
        console.error('Cannot draw: Already drawn maximum cards for this turn');
        updateCenterStatus('You have already drawn 2 cards this turn');
        return;
    }
    
    // Draw a card
    const card = dealCard(gameState.currentPlayer);
    if (!card) {
        updateCenterStatus('No more cards to draw');
        return;
    }
    
    // Update card count
    gameState.cardsDrawnThisTurn++;
    
    // Update the player's hand UI
    updatePlayerHandUI(gameState.currentPlayer);
    
    // Add to history
    addToHistory(`Player ${gameState.currentPlayer} drew a card.`);
    
    // Update center status
    if (gameState.cardsDrawnThisTurn < 2) {
        updateCenterStatus(`Drew 1 card. Click again to draw your second card.`);
    } else {
        gameState.hasDrawnCards = true;
        updateCenterStatus(`Drew 2 cards. Now play up to 3 cards or end your turn.`);
        updateGameStatus(`Your turn: You can play up to 3 cards`);
    }
    
    console.log(`Player ${gameState.currentPlayer} drew a card. Total cards drawn this turn: ${gameState.cardsDrawnThisTurn}`);
}

// Handle clicking the draw pile
function handleDrawPileClick() {
    console.log('Draw pile clicked');
    drawCard();
}

// Export functions to make them accessible to other modules
window.initializeDeck = initializeDeck;
window.shuffleDeck = shuffleDeck;
window.createCardElement = createCardElement;
window.updateCardsRemaining = updateCardsRemaining;
window.dealCard = dealCard;
window.drawCard = drawCard;
window.handleDrawPileClick = handleDrawPileClick; 