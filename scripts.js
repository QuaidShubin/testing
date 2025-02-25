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