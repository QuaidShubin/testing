# Monopoly Deal Technical Context

## Technologies Used

### Frontend

- **HTML5**: Structure and layout
- **CSS3**: Styling and animations
- **JavaScript**: Game logic and interactivity
- **Local Storage**: Game state persistence

### Development & Deployment

- **Browser Dev Tools**: Debugging and testing
- **Python SimpleHTTPServer**: Local development server
- **Version Control**: Git for source control

## Key Files

1. **index.html**

   - Main game interface
   - UI structure and layout

2. **styles.css**

   - Game styling
   - Card design and animations
   - Responsive layout

3. **scripts.js**

   - Core game logic
   - Event handlers
   - Game state management
   - UI updates

4. **cards.js**

   - Card definitions
   - Card behavior logic
   - Card interaction handlers

5. **gameState.js**
   - Game state structure
   - State initialization and updates
   - Game flow control

## Technical Constraints

1. **Browser Compatibility**

   - Must work in modern browsers
   - No external dependencies

2. **Performance**

   - Smooth card animations
   - Responsive UI

3. **State Management**
   - Consistent game state
   - Proper validation

## Development Setup

1. Clone repository
2. Navigate to project directory
3. Run `python -m http.server 8000` to start local server
4. Access game at http://localhost:8000

## Technical Debt & Issues

1. **Card Playability Logic**

   - Inconsistent checks for card playability
   - Player perspective vs. current player confusion

2. **Event Handling**

   - Possible missing or incorrect event handlers
   - Data attribute management issues

3. **Action Processing**
   - Action modals not appearing
   - Card actions not executing correctly
