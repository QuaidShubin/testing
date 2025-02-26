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
    
    // Modified to draw both cards at once
    const cardsToDraw = Math.min(2 - gameState.cardsDrawnThisTurn, 2);
    
    // Draw the cards
    for (let i = 0; i < cardsToDraw; i++) {
        dealCard(gameState.currentPlayer);
        gameState.cardsDrawnThisTurn++;
    }
    
    // Update the UI
    updatePlayerHandUI(gameState.currentPlayer);
    updateCardsRemaining();
    
    // Add to history
    addToHistory(`Player ${gameState.currentPlayer} drew ${cardsToDraw} card(s). Cards drawn this turn: ${gameState.cardsDrawnThisTurn}`, gameState.currentPlayer);
    
    // Update game state and UI based on number of cards drawn
    gameState.hasDrawnCards = true;
    gameState.turnState = 'canPlay';
    updateCenterStatus("You drew your cards. You can now play up to 3 cards.");
    
    // Enable the end turn button
    if (elements.endTurnButton) {
        elements.endTurnButton.disabled = false;
    }
    
    // Save game state to localStorage for multi-tab play
    saveGameState();
    
    console.log('Cards drawn successfully:', gameState.cardsDrawnThisTurn);
}

function resetGameState() {
    console.log('Resetting game state');
    
    // Clear properties of existing gameState object
    gameState.started = false;
    gameState.currentPlayer = 1;
    gameState.deck = [];
    gameState.discardPile = [];
    gameState.cardsPlayedThisTurn = 0;
    gameState.cardsDrawnThisTurn = 0;
    
    // CRITICAL FIX: Reset hasDrawnCards to false - this was missing and causing cards to not be playable
    gameState.hasDrawnCards = false;
    
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

    // Reset the game as started for convenience in testing
    gameState.gameStarted = true;
    
    console.log('Game state reset complete');
}

// CRITICAL FIX: Add direct click handler to card element
function handleCardClick(event) {
    console.log("================ CARD CLICK DEBUG ================");
    console.log(`Card clicked at index ${index}`);
    console.log(`Game state started: ${gameState.gameStarted}`);
    console.log(`Current player: ${gameState.currentPlayer}`);
    console.log(`Player perspective: ${getCurrentPlayerPerspective()}`);
    console.log(`Has drawn cards: ${gameState.hasDrawnCards}`);
    console.log(`Cards played this turn: ${gameState.cardsPlayedThisTurn}`);
    
    // ENHANCED DEBUG: Double-check isCardPlayable calculation again in click handler
    const clickIsCurrentPlayersTurn = gameState.currentPlayer === getCurrentPlayerPerspective();
    const clickHasDrawnCards = gameState.hasDrawnCards;
    const clickHasNotPlayedMaxCards = gameState.cardsPlayedThisTurn < 3;
    const clickIsCardPlayable = clickIsCurrentPlayersTurn && clickHasDrawnCards && clickHasNotPlayedMaxCards;
    
    console.log(`Rechecked playability in click handler:`);
    console.log(`- Is current player's turn: ${clickIsCurrentPlayersTurn}`);
    console.log(`- Has drawn cards: ${clickHasDrawnCards}`);
    console.log(`- Has not played max cards: ${clickHasNotPlayedMaxCards}`);
    console.log(`- Final isCardPlayable: ${clickIsCardPlayable}`);
    
    console.log(`isCardPlayable: ${isCardPlayable}`);
    console.log(`Card element:`, this);
    console.log(`Card data-card-index:`, this.getAttribute('data-card-index'));
    console.log(`Card dataset.cardIndex:`, this.dataset.cardIndex);
    
    // Stop propagation to prevent parent handlers firing
    event.stopPropagation();
    
    // Use the recalculated value for better reliability
    if (clickIsCardPlayable) {
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
} 