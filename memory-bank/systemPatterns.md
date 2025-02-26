# Monopoly Deal System Patterns

## System Architecture

The Monopoly Deal game follows a modular architecture with several key components:

1. **Game State Management**

   - Central game state object tracks all game information
   - State updates trigger UI updates
   - Saved to localStorage for persistence

2. **Card System**

   - Card definitions with types, values, and actions
   - Card rendering and display logic
   - Card interaction handlers

3. **Player Management**

   - Player hands, properties, and money piles
   - Turn management
   - Perspective handling (current player view)

4. **UI Components**
   - Game board layout
   - Card rendering
   - Action modals and prompts
   - Status messages

## Key Technical Decisions

1. **State-Driven UI**

   - UI elements update based on game state changes
   - Clear separation between state and presentation

2. **Event Delegation**

   - Card click handlers managed centrally
   - Action processing follows a consistent pattern

3. **Validation System**
   - Card playability checked before allowing play
   - Action validation ensures game rule compliance

## Component Relationships

```
GameState ───────┐
    │            │
    ▼            ▼
Card System    Player Management
    │            │
    └────┬───────┘
         │
         ▼
    UI Components
```

## Identified Issues

1. **Card Playability**

   - The `isCardPlayable` function may not be correctly determining if cards can be played
   - Player perspective vs. current player confusion

2. **Event Handling**

   - Card click events may not be properly connected to handlers
   - Data attributes might not be correctly set

3. **Action Processing**
   - Action modal popups not appearing when cards are clicked
   - Card actions not being processed correctly
