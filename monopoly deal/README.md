# Monopoly Deal Card Game

A simple web-based implementation of the popular Monopoly Deal card game for 2 players.

## How to Play

1. Open `index.html` in a web browser to start the game.
2. Click "Start New Game" to begin.
3. Players take turns. On each turn:
   - Draw 2 cards by clicking on the draw pile
   - Play up to 3 cards from your hand
   - Click "End Turn" when you're done

## Game Objective

Collect 3 complete property sets of different colors before your opponent does.

## Card Types

- **Property Cards**: Add these to your collection. Collect full sets of the same color.
- **Money Cards**: Play these into your bank to pay rent or charges.
- **Action Cards**: Special cards that let you:
  - Collect rent from other players
  - Steal properties
  - Charge money
  - Draw more cards
  - Add houses/hotels to increase rent value

## Game Rules

1. **Start of Turn**: Draw 2 cards from the deck.
2. **On Your Turn**: You can play up to 3 cards from your hand:
   - Play properties into your collection
   - Play money cards into your bank
   - Play action cards for their effects
3. **Property Sets**: Properties are grouped by color. A complete set has all cards of the same color.
4. **Money**: Money cards can be used to pay rent or charges. Most action and property cards can also be played as money.
5. **Rent**: Rent cards allow you to collect money from other players based on the properties you own.
6. **Winning**: The first player to collect 3 complete property sets of different colors wins.

## Implementation Features

- Full 106-card deck implementation
- Property sets with different rent values based on the Monopoly Deal rules
- Action cards with specific behaviors
- Turn-based gameplay
- Win condition tracking
