# Monopoly Deal - Active Context

## Current Work Focus

We're currently addressing critical issues with the game's core functionality:

1. **Card Dealing**: Fixed the issue where Player 1 was not receiving cards at the start of the game.
2. **Card Action Popups**: Fixed issues with the modal system for card actions not displaying properly.
3. **Syntax Errors**: Fixed critical syntax error in the JavaScript code that was preventing the game from running properly.
4. **Game State Tracking**: Fixed issues with the game state tracking for drawn cards and playable cards.
5. **Card Playability**: Fixed critical bugs in the card playability calculation and card click handling that were preventing cards from being played.

## Recent Changes

### 1. Card Reference System

- Added a missing `getCardById` function to properly retrieve card objects
- Fixed issues with card references in the update UI functions
- Ensured proper handling of both object and ID-based card references

### 2. Action Modal Improvements

- Fixed the `showActionOptions` function to properly display the card action popup
- Added proper error handling and debugging for modal display
- Fixed the cancel button handling in the modal
- Enhanced the `playActionCard` function to implement specific actions based on card type
- Added support for different action types (Pass Go, Rent) in the modal options

### 3. UI Updates

- Fixed issues with the `updatePlayerHandUI` function to properly set card click handlers
- Corrected player indexing issues (using 0-based vs 1-based indices)
- Added better error handling and logging

### 4. Card Playability Fix

- Fixed a critical bug in the `isCurrentPlayerTurn` calculation in `updatePlayerHandUI`
- The bug was comparing `gameState.currentPlayer` to `playerIndex` (the player whose hand we're updating) instead of to the current player perspective
- Updated the calculation to correctly check if the current player matches the player's perspective
- Simplified the card playability logic to make it clearer and more robust
- Enhanced debugging to show the values of each condition in the playability check
- This ensures that cards are now properly playable when all other conditions are met

### 5. Card Click Handler Fixes

- Fixed data attribute handling for card index
- Added duplicate dataset.cardIndex property for better compatibility
- Enhanced logging to show the card element and its attributes
- Modified the card click handler to directly call `playCardWithIndex` with the correct index
- This bypasses the potentially problematic event target handling in `handleCardPlay`
- Added extensive debugging to trace the exact flow of card interactions

### 6. Syntax Error Fixes

- Removed an extra closing bracket in the `addSwitchPerspectiveButton` function that was causing the game to crash
- Fixed JavaScript syntax errors that were preventing the game from loading properly

### 7. Debugging Enhancements

- Added detailed debug logging in the card click handler to diagnose why cards aren't responding to clicks
- Added debug logging in the `drawCard` function to monitor the `hasDrawnCards` state flag
- Enhanced console output to better trace the game flow
- Added detailed logging for modal operations to diagnose display issues

### 8. Player Perspective Fixes

- Fixed an issue where the card playability check was inconsistent with the player perspective
- Added a new `allowCardPlay` variable that correctly handles card clicks regardless of perspective issues
- Updated the `handleCardPlay` function to properly check player perspective
- Enhanced error messages to provide more detailed information about why cards can't be played

## Previous Investigation

We were investigating two main issues:

1. **Cards Not Responding to Clicks**: Fixed by correcting perspective handling, card playability checks, the `isCurrentPlayerTurn` calculation, and data attribute handling
2. **Action Modals Not Displaying**: Fixed by improving the modal system with better error handling and debugging

The investigation focused on these areas:

1. **Card Playability Logic**: Identifying why cards weren't playable even when all conditions seemed to be met
2. **Data Attribute Handling**: Ensuring card indexes are properly stored and retrieved
3. **Event Flow**: Tracing the path from click to card action to identify breakpoints
4. **Modal Display System**: Identifying why the action selection modal wasn't appearing when cards were played
5. **Cancel Button Handling**: Fixing issues with the cancel button not working properly in the modal
6. **Action Card Handling**: Implementing specific actions for different card types
7. **Game State Flags**: Ensuring proper tracking of game state for card playability

## Known Issues

1. **Duplicate Functions**: There are multiple implementations of some functions (e.g., `togglePlayerAreas`) causing potential conflicts
2. **State Management**: Inconsistent state updates across different game actions
3. **Error Handling**: Limited error handling for edge cases
4. **Event Bubbling**: Some click events may be captured by parent elements unintentionally

## Next Steps

### Immediate Priorities

1. **Test Card Playability Fix**: Verify that cards can now be played when all conditions are met
2. **Test Card Action Modals**: Verify that action cards now properly display their modal with correct options
3. **Test Pass Go Functionality**: Ensure that playing a Pass Go card correctly allows drawing 2 additional cards
4. **Test Rent Collection**: Verify that Rent cards display the appropriate options for collecting rent
5. **Complete Game Flow Testing**: Ensure a complete turn can be executed (draw cards, play cards, end turn)

### Medium-Term Improvements

1. **Implement More Card Actions**: Add functionality for all the different action card types
2. **Refactor Duplicate Functions**: Merge duplicate implementations and ensure consistent behavior
3. **Improve Error Handling**: Add more robust error handling throughout the codebase
4. **Enhance UI Feedback**: Add more visual cues for valid actions and game state changes

### Long-Term Goals

1. **Code Reorganization**: Better separation of concerns between game logic and UI
2. **Performance Optimization**: Reduce unnecessary DOM updates and improve rendering efficiency
3. **Enhanced Features**: Add customizable rules, game saving/loading, and potentially AI opponents

## Current Decisions

1. **Modal Architecture**: Use a consistent approach for displaying modals using the `showActionOptions` function
2. **Card Action Implementation**: Implement specific actions for each card type using a switch statement in `playActionCard`
3. **Debug-First Approach**: Add comprehensive logging to trace issues with game flow and UI interactions
4. **Error Handling**: Add progressive error handling focusing first on critical paths
5. **Direct Card Handling**: Directly call `playCardWithIndex` from the card click handler to bypass event complexities

## Technical Questions to Resolve

1. How to best implement the full range of card actions (Deal Breaker, Just Say No, etc.)?
2. What's the optimal way to handle targeting other players for card actions?
3. How should we implement the rule that you can play 3 cards per turn?
4. How to handle special cases like Double The Rent which counts as its own action?
5. What's the best approach to implement the payment system for cards like Debt Collector?
6. Should we add animation effects for card movements to enhance user experience?
