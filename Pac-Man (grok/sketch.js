// Maze layout (30 rows x 28 columns)
const initialMaze = [
  "############################",
  "#............##............#",
  "#.####.#####.##.#####.####.#",
  "#o#  #.#   #.##.#   #.#  #o#",
  "#.####.#####.##.#####.####.#",
  "#..........................#",
  "#.####.##.########.##.####.#",
  "#.####.##.########.##.####.#",
  "#......##....##....##......#",
  "######.##### ## #####.######",
  "     #.#     gg     #.#     ",
  "     #.#    g  g    #.#     ",
  "######.# ggg####ggg #.######",
  "      .  g      g   .      ",
  "######.# ggg####ggg #.######",
  "     #.#    g  g    #.#     ",
  "     #.#     gg     #.#     ",
  "######.##### ## #####.######",
  "#............##............#",
  "#.####.#####.##.#####.####.#",
  "#.####.#####.##.#####.####.#",
  "#......##....##....##......#",
  "#.##########.##.##########.#",
  "#.##########.##.##########.#",
  "#..........................#",
  "#.####.#####.##.#####.####.#",
  "#o#  #.#   #.##.#   #.#  #o#",
  "#.####.#####.##.#####.####.#",
  "#............##............#",
  "############################"
];

// Level 2 maze - more complex - fixing ghost movement paths
const level2Maze = [
"############################",
"#o...........##...........o#",
"#.##########.##.##########.#",
"#.##########.##.##########.#",
"#..........................#",
"#.####.##.########.##.####.#",
"#.####.##.########.##.####.#",
"#......##....##....##......#",
"######.##### ## #####.######",
"     #.#     gg     #.#     ",
"     #.#    g  g    #.#     ",
"######.# ggg####ggg #.######",
"      .  g      g   .      ",
"######.# ggg####ggg #.######",
"     #.#    g  g    #.#     ",
"     #.#     gg     #.#     ",
"######.##### ## #####.######",
"#............##............#",
"#.####.#####.##.#####.####.#",
"#.####.#####.##.#####.####.#",
"#......##....##....##......#",
"#.####.##.########.##.####.#",
"#.####.##.########.##.####.#",
"#..........................#",
"#.####.#####.##.#####.####.#",
"#o#  #.#   #.##.#   #.#  #o#",
"#.####.#####.##.#####.####.#",
"#............##............#",
"############################"
];

// Level 3 maze - fixed to ensure all pellets are accessible
const level3Maze = [
"############################",
"#o...........##...........o#",
"#.####.#####.##.#####.####.#",
"#.####.#####.##.#####.####.#",
"#..........................#",
"#.####.##.########.##.####.#",
"#.#  #.##.########.##.#  #.#",
"#.#  #.##....##....##.#  #.#",
"#.####.##### ## #####.####.#",
"#......#     gg     #......#",
"#.####.#    g  g    #.####.#",
"#.#  #.# ggg####ggg #.#  #.#",
"#.#  #.  g      g   .#  #.#",
"#.####.# ggg####ggg #.####.#",
"#......#    g  g    #......#",
"#.####.#     gg     #.####.#",
"#.####.##### ## #####.####.#",
"#.#  #......##......#  #.#.#",
"#.#  #.#####.##.#####.#  #.#",
"#.####.#####.##.#####.####.#",
"#......##....##....##......#",
"######.##.########.##.######",
"#......##.########.##......#",
"#.........................#",
"#.####.#####.##.#####.####.#",
"#o#  #.#   #.##.#   #.#  #o#",
"#.####.#####.##.#####.####.#",
"#............##............#",
"############################"
];

// Array of mazes for different levels
const mazeLayouts = [initialMaze, level2Maze, level3Maze];

// === Game Constants ===
let tileSize = 30; // Bigger tiles make the canvas larger
const mazeRows = initialMaze.length;
const mazeCols = initialMaze[0].length;
let canvasWidth = mazeCols * tileSize;
let canvasHeight = mazeRows * tileSize + 40;
const speed = 0.1;

// Ghost personality types
const GHOST_PERSONALITIES = {
CHASE: 'chase',      // Directly targets Pac-Man (Red ghost - Blinky)
AMBUSH: 'ambush',    // Targets position ahead of Pac-Man (Pink ghost - Pinky)
CONFUSED: 'confused', // Alternates between chase and scatter (Cyan ghost - Inky)
RANDOM: 'random',     // Moves randomly (Orange ghost - Clyde)
GUARD: 'guard'       // Guards the fruit (Golden ghost)
};

// Level-specific difficulty settings
const LEVELS = 3;
let currentLevel = 1;
let ghostSpeed = 0.8; // Base speed multiplier
let vulnerableTime = 600; // Base vulnerable time

// Fruit feature constants
let fruitActive = false;
let fruitX = 0;
let fruitY = 0;
let fruitSpawnTime = 600; // Time until fruit spawns (in frames)
let fruitTimer = 0;
let fruitPoints = 500;

// Golden ghosts to protect the fruit
let goldenGhosts = [];

// Hangman game variables
let hangmanActive = false;
let hangmanWord = "";
let hangmanGuessed = [];
let hangmanWrong = 0;
let hangmanMaxWrong = 6;
let hangmanWords = [
  "PACMAN", "GHOST", "CHERRY", "PELLET", "MAZE",
  "BLINKY", "PINKY", "INKY", "CLYDE", "ARCADE",
  "RETRO", "CLASSIC", "GAMING", "WAKAWAKA"
];
let ghostVanishTime = 0; // Timer for ghost vanishing after hangman win

// === Game Variables ===
let maze = [];
let pacman = { 
tileX: 14, 
tileY: 23, 
dirX: -1, 
dirY: 0, 
desiredDirX: -1, 
desiredDirY: 0, 
progress: 0 
};

// Ghosts with personalities
let ghosts = [
{ 
  tileX: 14, tileY: 11, initialTileX: 14, initialTileY: 11, 
  dirX: 0, dirY: -1, progress: 0, 
  color: [255, 0, 0], 
  state: 'normal',
  personality: GHOST_PERSONALITIES.CHASE,
  name: 'Blinky'
},
{ 
  tileX: 13, tileY: 13, initialTileX: 13, initialTileY: 13, 
  dirX: 0, dirY: 1, progress: 0, 
  color: [255, 105, 180], 
  state: 'normal',
  personality: GHOST_PERSONALITIES.AMBUSH,
  name: 'Pinky'
},
{ 
  tileX: 15, tileY: 13, initialTileX: 15, initialTileY: 13, 
  dirX: 0, dirY: 1, progress: 0, 
  color: [0, 255, 255], 
  state: 'normal',
  personality: GHOST_PERSONALITIES.CONFUSED,
  name: 'Inky'
},
{ 
  tileX: 14, tileY: 13, initialTileX: 14, initialTileY: 13, 
  dirX: 0, dirY: 1, progress: 0, 
  color: [255, 165, 0], 
  state: 'normal',
  personality: GHOST_PERSONALITIES.RANDOM,
  name: 'Clyde'
}
];

let score = 0, lives = 3, gameState = 'playing', dotCount = 0, vulnerableTimer = 0;
let resetButton, nextLevelButton;

function setup() {
let cnv = createCanvas(canvasWidth, canvasHeight);
// Center the canvas in the window
cnv.position((windowWidth - canvasWidth) / 2, (windowHeight - canvasHeight) / 2);

resetButton = createButton('Reset Game')
  .position(width / 2 - 50, height / 2 + 40)
  .mousePressed(resetGame)
  .hide();
  
nextLevelButton = createButton('Next Level')
  .position(width / 2 - 50, height / 2 + 40)
  .mousePressed(startNextLevel)
  .hide();
  
resetGame();
}

function windowResized() {
// Recenter canvas on window resize
canvasWidth = mazeCols * tileSize;
canvasHeight = mazeRows * tileSize + 40;
resizeCanvas(canvasWidth, canvasHeight);
let cnv = canvas;
cnv.position((windowWidth - canvasWidth) / 2, (windowHeight - canvasHeight) / 2);

// Reposition buttons
resetButton.position(width / 2 - 50, height / 2 + 40);
nextLevelButton.position(width / 2 - 50, height / 2 + 40);
}

function draw() {
background(0);

if (gameState === 'playing') {
  if (hangmanActive) {
    drawHangman();
  } else {
    updatePacMan();
    updateGhosts();
    
    // Update golden ghosts if fruit is active
    if (fruitActive) {
      updateGoldenGhosts();
    }
    
    checkCollisions();
    drawMaze();
    drawPacMan();
    drawGhosts();
    
    // Draw fruit if active
    if (fruitActive) {
      drawFruit();
      drawGoldenGhosts();
    }
    
    drawUI();
    
    // Timer for fruit spawn
    if (!fruitActive && fruitTimer <= 0 && !hangmanActive) {
      spawnFruit();
    } else if (!fruitActive && !hangmanActive) {
      fruitTimer--;
    }
  }
  
  if (vulnerableTimer > 0) vulnerableTimer--;
  else {
    // When power pellet wears off, change any ghost that is still vulnerable...
    ghosts.forEach(g => {
      if (g.state === 'vulnerable') g.state = 'normal';
      // Respawn eaten ghosts only when pellet effect is over
      if (g.state === 'eaten') {
        g.tileX = g.initialTileX;
        g.tileY = g.initialTileY;
        g.progress = 0;
        g.state = 'normal';
      }
    });
    
    // Reset golden ghosts too
    goldenGhosts.forEach(g => {
      if (g.state === 'vulnerable') g.state = 'normal';
    });
  }
  
  // Handle ghosts vanishing after hangman win
  if (ghostVanishTime > 0) {
    ghostVanishTime--;
    if (ghostVanishTime === 0) {
      // Restore ghosts to normal
      ghosts.forEach(g => {
        g.tileX = g.initialTileX;
        g.tileY = g.initialTileY;
        g.progress = 0;
        g.state = 'normal';
      });
    }
  }
  
  // Check if level is complete
  if (dotCount === 0) {
    gameState = 'levelComplete';
  }
} else if (gameState === 'gameover') {
  // Draw the game elements in the background
  drawMaze();
  drawPacMan();
  drawGhosts();
  
  // Draw game over screen
  drawGameOver();
} else if (gameState === 'levelComplete') {
  // Draw the game elements in the background
  drawMaze();
  drawPacMan();
  drawGhosts();
  
  // Draw level complete screen
  drawLevelComplete();
}
}

function drawMaze() {
for (let row = 0; row < maze.length; row++) {
  for (let col = 0; col < maze[row].length; col++) {
    let cell = maze[row][col];
    if (cell === 1) {
      fill(0, 0, 139);
      rect(col * tileSize, row * tileSize, tileSize, tileSize);
    } else if (cell === 0) {
      fill(255);
      ellipse(col * tileSize + tileSize/2, row * tileSize + tileSize/2, 4, 4);
    } else if (cell === 2) {
      fill(255);
      ellipse(col * tileSize + tileSize/2, row * tileSize + tileSize/2, 10, 10);
    }
    // Cells with other values (like 3 or 5) are drawn as empty paths.
  }
}
}

function drawPacMan() {
let x = (pacman.tileX + pacman.progress * pacman.dirX) * tileSize + tileSize/2;
let y = (pacman.tileY + pacman.progress * pacman.dirY) * tileSize + tileSize/2;
push();
translate(x, y);
let angle = 0;
if (pacman.dirX === 1) angle = 0;
else if (pacman.dirX === -1) angle = PI;
else if (pacman.dirY === 1) angle = HALF_PI;
else if (pacman.dirY === -1) angle = -HALF_PI;
rotate(angle);
fill(255,255,0);
let mouthAngle = PI/6 * (1 + sin(frameCount * 0.2));
arc(0, 0, tileSize, tileSize, mouthAngle, TWO_PI - mouthAngle, PIE);
fill(0);
ellipse(tileSize/8, -tileSize/4, tileSize/8, tileSize/8);
pop();
}

function drawGhosts() {
for (let ghost of ghosts) {
  // Do not draw ghosts that are eaten
  if (ghost.state === 'eaten') continue;
  
  let x = (ghost.tileX + ghost.progress * ghost.dirX) * tileSize + tileSize/2;
  let y = (ghost.tileY + ghost.progress * ghost.dirY) * tileSize + tileSize/2;
  fill(ghost.state === 'vulnerable' ? [0,0,255] : ghost.color);
  arc(x, y - tileSize/4, tileSize, tileSize, PI, TWO_PI);
  rect(x - tileSize/2, y - tileSize/4, tileSize, tileSize/2);
  triangle(x - tileSize/2, y + tileSize/4,
           x - tileSize/6, y + tileSize/2,
           x - tileSize/3, y + tileSize/4);
  triangle(x, y + tileSize/4,
           x + tileSize/6, y + tileSize/2,
           x + tileSize/3, y + tileSize/4);
  fill(255);
  ellipse(x - tileSize/4, y - tileSize/4, tileSize/4, tileSize/4);
  ellipse(x + tileSize/4, y - tileSize/4, tileSize/4, tileSize/4);
  fill(0);
  let pupilOffset = tileSize/16 * (ghost.dirX || ghost.dirY);
  ellipse(x - tileSize/4 + (ghost.dirX ? pupilOffset : 0),
          y - tileSize/4 - (ghost.dirY ? pupilOffset : 0),
          tileSize/8, tileSize/8);
  ellipse(x + tileSize/4 + (ghost.dirX ? pupilOffset : 0),
          y - tileSize/4 - (ghost.dirY ? pupilOffset : 0),
          tileSize/8, tileSize/8);
}
}

function updatePacMan() {
// Check desired direction with horizontal wrap-around
let nextX = pacman.tileX + pacman.desiredDirX;
let nextY = pacman.tileY + pacman.desiredDirY;
if (nextX < 0) nextX = mazeCols - 1;
if (nextX >= mazeCols) nextX = 0;
if (nextX >= 0 && nextX < mazeCols && nextY >= 0 && nextY < mazeRows && (maze[nextY][nextX] !== 1 && maze[nextY][nextX] !== 5)) {
  pacman.dirX = pacman.desiredDirX;
  pacman.dirY = pacman.desiredDirY;
}
nextX = pacman.tileX + pacman.dirX;
nextY = pacman.tileY + pacman.dirY;
if (nextX < 0) nextX = mazeCols - 1;
if (nextX >= mazeCols) nextX = 0;
if (nextX >= 0 && nextX < mazeCols && nextY >= 0 && nextY < mazeRows && (maze[nextY][nextX] !== 1 && maze[nextY][nextX] !== 5)) {
  pacman.progress += speed;
  if (pacman.progress >= 1) {
    pacman.tileX = nextX;
    pacman.tileY = nextY;
    pacman.progress = 0;
    let cell = maze[pacman.tileY][pacman.tileX];
    if (cell === 0) {
      maze[pacman.tileY][pacman.tileX] = 4;
      score += 10;
      dotCount--;
    } else if (cell === 2) {
      maze[pacman.tileY][pacman.tileX] = 4;
      score += 50;
      dotCount--;
      // Activate power pellet effect
      ghosts.forEach(g => { if(g.state === 'normal') g.state = 'vulnerable'; });
      vulnerableTimer = vulnerableTime; // Use level-specific vulnerable time
    }
    if (dotCount === 0) {
      gameState = 'levelComplete';
    }
  }
}
}

function updateGhosts() {
for (let ghost of ghosts) {
  // Skip update if ghost is eaten (waiting to respawn)
  if (ghost.state === 'eaten') continue;
  
  // Apply level-specific speed multiplier
  ghost.progress += speed * ghostSpeed;
  
  if (ghost.progress >= 1) {
    // Determine new target cell with horizontal wrap-around.
    let newX = ghost.tileX + ghost.dirX;
    let newY = ghost.tileY + ghost.dirY;
    if (newX < 0) newX = mazeCols - 1;
    if (newX >= mazeCols) newX = 0;
    if (newY < 0 || newY >= mazeRows) newY = ghost.tileY;
    
    ghost.tileX = newX;
    ghost.tileY = newY;
    ghost.progress = 0;
    
    // Recalculate direction at intersections.
    let possible = [];
    let dirs = [
      { dirX: 0, dirY: -1 },
      { dirX: 0, dirY: 1 },
      { dirX: -1, dirY: 0 },
      { dirX: 1, dirY: 0 }
    ];
    
    for (let d of dirs) {
      // Do not allow reversing direction.
      if (d.dirX === -ghost.dirX && d.dirY === -ghost.dirY) continue;
      let nx = ghost.tileX + d.dirX;
      let ny = ghost.tileY + d.dirY;
      if (nx < 0) nx = mazeCols - 1;
      if (nx >= mazeCols) nx = 0;
      if (ny < 0 || ny >= mazeRows) continue;
      
      // Use a helper that lets ghosts pass if the cell is a ghost door.
      if (isPassableForGhost(nx, ny)) {
        possible.push(d);
      }
    }
    
    if (possible.length > 0) {
      if (ghost.state === 'vulnerable') {
        // When vulnerable, move randomly
        let choice = possible[Math.floor(Math.random() * possible.length)];
        ghost.dirX = choice.dirX;
        ghost.dirY = choice.dirY;
      } else {
        // Different movement based on personality
        let target = { x: pacman.tileX, y: pacman.tileY };
        
        switch (ghost.personality) {
          case GHOST_PERSONALITIES.CHASE:
            // Directly chase Pac-Man (Blinky)
            // Target is already set to Pac-Man's position
            break;
            
          case GHOST_PERSONALITIES.AMBUSH:
            // Target position 4 tiles ahead of Pac-Man (Pinky)
            target.x = pacman.tileX + 4 * pacman.dirX;
            target.y = pacman.tileY + 4 * pacman.dirY;
            // Ensure target is within bounds
            if (target.x < 0) target.x = 0;
            if (target.x >= mazeCols) target.x = mazeCols - 1;
            if (target.y < 0) target.y = 0;
            if (target.y >= mazeRows) target.y = mazeRows - 1;
            break;
            
          case GHOST_PERSONALITIES.CONFUSED:
            // Alternate between chasing Pac-Man and moving randomly (Inky)
            if (frameCount % 300 < 150) {
              // Chase for 150 frames
              // Target is already set to Pac-Man's position
            } else {
              // Choose a random target for 150 frames
              target.x = Math.floor(Math.random() * mazeCols);
              target.y = Math.floor(Math.random() * mazeRows);
            }
            break;
            
          case GHOST_PERSONALITIES.RANDOM:
            // Move randomly (Clyde)
            let choice = possible[Math.floor(Math.random() * possible.length)];
            ghost.dirX = choice.dirX;
            ghost.dirY = choice.dirY;
            return; // Skip the targeting logic below
        }
        
        // Choose the direction that minimizes distance to target
        let best = possible[0];
        let bestDist = dist(ghost.tileX + best.dirX, ghost.tileY + best.dirY, target.x, target.y);
        
        for (let d of possible) {
          let dDist = dist(ghost.tileX + d.dirX, ghost.tileY + d.dirY, target.x, target.y);
          if (dDist < bestDist) {
            best = d;
            bestDist = dDist;
          }
        }
        
        ghost.dirX = best.dirX;
        ghost.dirY = best.dirY;
      }
    }
  }
}
}

// Helper: ghosts treat cells as passable if they are not walls,
// OR if the cell is a designated ghost door.
function isPassableForGhost(x, y) {
if (maze[y][x] !== 1) return true;
return isGhostDoor(x, y);
}

// Define the ghost door zone: here we let ghosts run through walls
// at the bottom middle left/right of the ghost house.
function isGhostDoor(x, y) {
return (y === 14 && (x === 12 || x === 15));
}

// Update check collisions to include fruit and golden ghosts
function checkCollisions() {
// Check collisions with regular ghosts
for (let ghost of ghosts) {
  // Skip collision check if ghost is eaten.
  if (ghost.state === 'eaten') continue;
  
  let gx = ghost.tileX + ghost.progress * ghost.dirX;
  let gy = ghost.tileY + ghost.progress * ghost.dirY;
  let px = pacman.tileX + pacman.progress * pacman.dirX;
  let py = pacman.tileY + pacman.progress * pacman.dirY;
  if (Math.abs(gx - px) < 0.5 && Math.abs(gy - py) < 0.5) {
    if (ghost.state === 'vulnerable') {
      // Instead of immediate respawn, mark ghost as eaten and hide it.
      ghost.state = 'eaten';
      ghost.tileX = -10;
      ghost.tileY = -10;
      ghost.progress = 0;
      score += 200;
    } else if (ghost.state === 'normal') {
      lives--;
      // Reset Pac-Man's position.
      pacman.tileX = 14;
      pacman.tileY = 23;
      pacman.dirX = -1;
      pacman.dirY = 0;
      pacman.progress = 0;
      
      // Reset ghost positions
      for (let g of ghosts) {
        if (g.state !== 'eaten') { // Don't move eaten ghosts
          g.tileX = g.initialTileX;
          g.tileY = g.initialTileY;
          g.progress = 0;
        }
      }
      
      if (lives <= 0) gameState = 'gameover';
    }
  }
}

// Check collisions with golden ghosts
for (let ghost of goldenGhosts) {
  // Skip collision check if ghost is eaten
  if (ghost.state === 'eaten') continue;
  
  let gx = ghost.tileX + ghost.progress * ghost.dirX;
  let gy = ghost.tileY + ghost.progress * ghost.dirY;
  let px = pacman.tileX + pacman.progress * pacman.dirX;
  let py = pacman.tileY + pacman.progress * pacman.dirY;
  
  if (Math.abs(gx - px) < 0.5 && Math.abs(gy - py) < 0.5) {
    if (ghost.state === 'vulnerable') {
      // Mark ghost as eaten and hide it
      ghost.state = 'eaten';
      ghost.tileX = -10;
      ghost.tileY = -10;
      ghost.progress = 0;
      score += 300;
    } else if (ghost.state === 'normal') {
      lives--;
      // Reset Pac-Man's position
      pacman.tileX = 14;
      pacman.tileY = 23;
      pacman.dirX = -1;
      pacman.dirY = 0;
      pacman.progress = 0;
      
      // Reset ghost positions
      for (let g of ghosts) {
        if (g.state !== 'eaten') { // Don't move eaten ghosts
          g.tileX = g.initialTileX;
          g.tileY = g.initialTileY;
          g.progress = 0;
        }
      }
      
      if (lives <= 0) gameState = 'gameover';
    }
  }
}

// Check collision with fruit
if (fruitActive) {
  let px = pacman.tileX + pacman.progress * pacman.dirX;
  let py = pacman.tileY + pacman.progress * pacman.dirY;
  
  if (Math.abs(fruitX - px) < 0.5 && Math.abs(fruitY - py) < 0.5) {
    // Collect fruit
    fruitActive = false;
    score += fruitPoints;
    fruitTimer = fruitSpawnTime;
    
    // Start the hangman game
    startHangman();
  }
}
}

function drawUI() {
fill(255);
textSize(16);
textAlign(LEFT);
text('Score: ' + score, 10, canvasHeight - 20);

// Display current level
textAlign(CENTER);
text('Level: ' + currentLevel, canvasWidth / 2, canvasHeight - 20);

// Draw heart icons for lives instead of text
drawHearts();
}

// Draw heart icons to represent lives
function drawHearts() {
for (let i = 0; i < lives; i++) {
  let heartX = canvasWidth - 30 - (i * 25);
  let heartY = canvasHeight - 25;
  let heartSize = 20;
  
  fill(255, 0, 0); // Red hearts
  
  // Draw a heart shape using beginShape()
  beginShape();
  vertex(heartX, heartY);
  bezierVertex(heartX - heartSize/2, heartY - heartSize/2, 
               heartX - heartSize, heartY + heartSize/3, 
               heartX, heartY + heartSize/1.5);
  bezierVertex(heartX + heartSize, heartY + heartSize/3, 
               heartX + heartSize/2, heartY - heartSize/2, 
               heartX, heartY);
  endShape(CLOSE);
}
}

function drawGameOver() {
// Semi-transparent overlay
fill(0, 0, 0, 200);
rect(0, 0, width, height);

// Game over text
fill(255, 0, 0);
textSize(48);
textAlign(CENTER);
text('GAME OVER', width / 2, height / 2 - 80);

// Display final stats
fill(255);
textSize(24);
text('Final Score: ' + score, width / 2, height / 2 - 20);
text('Level: ' + currentLevel, width / 2, height / 2 + 10);

// Display reset button
resetButton.show();
nextLevelButton.hide();
}

function drawLevelComplete() {
// Semi-transparent overlay
fill(0, 0, 0, 200);
rect(0, 0, width, height);

fill(255, 255, 0);
textSize(48);
textAlign(CENTER);

if (currentLevel < LEVELS) {
  text('LEVEL COMPLETE!', width / 2, height / 2 - 80);
  
  // Display stats
  fill(255);
  textSize(24);
  text('Score: ' + score, width / 2, height / 2 - 20);
  text('Level ' + currentLevel + ' Completed!', width / 2, height / 2 + 10);
  
  // Display next level button
  nextLevelButton.show();
  resetButton.hide();
} else {
  text('GAME COMPLETE!', width / 2, height / 2 - 80);
  
  // Display final stats
  fill(255);
  textSize(24);
  text('Final Score: ' + score, width / 2, height / 2 - 20);
  text('All Levels Completed!', width / 2, height / 2 + 10);
  
  // Display reset button
  resetButton.show();
  nextLevelButton.hide();
}
}

function startNextLevel() {
if (currentLevel < LEVELS) {
  currentLevel++;
  
  // Increase difficulty
  ghostSpeed += 0.1; // Ghosts get faster
  vulnerableTime = Math.max(200, vulnerableTime - 150); // Shorter vulnerability time
  
  // Reset level
  resetLevel();
  
  // Hide buttons
  resetButton.hide();
  nextLevelButton.hide();
}
}

function resetLevel() {
// Map the characters to cell values for the current level
maze = mazeLayouts[currentLevel-1].map(row => row.split('').map(cell => {
  switch(cell) {
    case '#': return 1;
    case '.': return 0;
    case 'o': return 2;
    case ' ': return 4;
    case 'g': return 3;
    default: return 1;
  }
}));

// Reset Pac-Man
pacman = { 
  tileX: 14, 
  tileY: 23, 
  dirX: -1, 
  dirY: 0, 
  desiredDirX: -1, 
  desiredDirY: 0, 
  progress: 0 
};

// Reset ghosts
ghosts = [
  { 
    tileX: 14, tileY: 11, initialTileX: 14, initialTileY: 11, 
    dirX: 0, dirY: -1, progress: 0, 
    color: [255, 0, 0], 
    state: 'normal',
    personality: GHOST_PERSONALITIES.CHASE,
    name: 'Blinky'
  },
  { 
    tileX: 13, tileY: 13, initialTileX: 13, initialTileY: 13, 
    dirX: 0, dirY: 1, progress: 0, 
    color: [255, 105, 180], 
    state: 'normal',
    personality: GHOST_PERSONALITIES.AMBUSH,
    name: 'Pinky'
  },
  { 
    tileX: 15, tileY: 13, initialTileX: 15, initialTileY: 13, 
    dirX: 0, dirY: 1, progress: 0, 
    color: [0, 255, 255], 
    state: 'normal',
    personality: GHOST_PERSONALITIES.CONFUSED,
    name: 'Inky'
  },
  { 
    tileX: 14, tileY: 13, initialTileX: 14, initialTileY: 13, 
    dirX: 0, dirY: 1, progress: 0, 
    color: [255, 165, 0], 
    state: 'normal',
    personality: GHOST_PERSONALITIES.RANDOM,
    name: 'Clyde'
  }
];

// Reset golden ghosts array
goldenGhosts = [];

// Reset game variables
gameState = 'playing';
vulnerableTimer = 0;
dotCount = 0;
fruitActive = false;
fruitTimer = fruitSpawnTime;
hangmanActive = false;
ghostVanishTime = 0;

// Count pellets
for (let row of maze) {
  for (let cell of row) {
    if (cell === 0 || cell === 2) dotCount++;
  }
}
}

function resetGame() {
// Reset level and score
currentLevel = 1;
score = 0;
lives = 3;

// Reset difficulty parameters
ghostSpeed = 0.8; 
vulnerableTime = 600;

// Reset fruit and hangman variables
fruitActive = false;
fruitTimer = fruitSpawnTime;
hangmanActive = false;
ghostVanishTime = 0;
goldenGhosts = [];

// Initialize first level
resetLevel();

// Hide buttons
if (resetButton) resetButton.hide();
if (nextLevelButton) nextLevelButton.hide();
}

function keyPressed() {
if (hangmanActive) {
  // Handle key presses for hangman game
  let key = String.fromCharCode(keyCode);
  
  // Only accept letter keys A-Z
  if (/^[A-Z]$/.test(key)) {
    processHangmanGuess(key);
  }
  return;
}

if (keyCode === LEFT_ARROW) {
  pacman.desiredDirX = -1;
  pacman.desiredDirY = 0;
} else if (keyCode === RIGHT_ARROW) {
  pacman.desiredDirX = 1;
  pacman.desiredDirY = 0;
} else if (keyCode === UP_ARROW) {
  pacman.desiredDirX = 0;
  pacman.desiredDirY = -1;
} else if (keyCode === DOWN_ARROW) {
  pacman.desiredDirX = 0;
  pacman.desiredDirY = 1;
}
}

// Spawn a fruit at a random empty location
function spawnFruit() {
  // Find all empty cells
  let emptyCells = [];
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 4) { // Empty cell
        emptyCells.push({x, y});
      }
    }
  }
  
  // If there are empty cells, choose one randomly
  if (emptyCells.length > 0) {
    let cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    fruitX = cell.x;
    fruitY = cell.y;
    fruitActive = true;
    
    // Spawn two golden ghosts to protect the fruit
    spawnGoldenGhosts();
  }
}

// Spawn two golden ghosts to protect the fruit
function spawnGoldenGhosts() {
  goldenGhosts = [];
  
  // Find cells near the fruit
  let directions = [
    {x: 1, y: 0},
    {x: -1, y: 0},
    {x: 0, y: 1},
    {x: 0, y: -1}
  ];
  
  // Find valid positions for the golden ghosts
  let positions = [];
  for (let dir of directions) {
    let x = fruitX + dir.x;
    let y = fruitY + dir.y;
    
    // Check if position is valid (not a wall)
    if (x >= 0 && x < mazeCols && y >= 0 && y < mazeRows && maze[y][x] !== 1) {
      positions.push({x, y});
    }
  }
  
  // If we have at least 2 valid positions
  if (positions.length >= 2) {
    // Pick 2 random positions
    for (let i = 0; i < 2; i++) {
      if (positions.length === 0) break;
      
      let index = Math.floor(Math.random() * positions.length);
      let pos = positions[index];
      positions.splice(index, 1);
      
      // Create golden ghost
      goldenGhosts.push({
        tileX: pos.x,
        tileY: pos.y,
        dirX: 0,
        dirY: 0,
        progress: 0,
        color: [255, 215, 0], // Gold color
        state: 'normal',
        personality: GHOST_PERSONALITIES.GUARD
      });
    }
  }
}

// Draw the fruit
function drawFruit() {
  let x = fruitX * tileSize + tileSize/2;
  let y = fruitY * tileSize + tileSize/2;
  
  // Draw a cherry
  fill(255, 0, 0); // Red
  ellipse(x - 5, y, tileSize/2, tileSize/2);
  ellipse(x + 5, y, tileSize/2, tileSize/2);
  
  // Stem
  stroke(0, 100, 0); // Dark green
  strokeWeight(2);
  line(x, y - tileSize/4, x, y - tileSize/2);
  noStroke();
}

// Draw the golden ghosts
function drawGoldenGhosts() {
  for (let ghost of goldenGhosts) {
    // Don't draw eaten ghosts
    if (ghost.state === 'eaten') continue;
    
    let x = (ghost.tileX + ghost.progress * ghost.dirX) * tileSize + tileSize/2;
    let y = (ghost.tileY + ghost.progress * ghost.dirY) * tileSize + tileSize/2;
    fill(ghost.state === 'vulnerable' ? [0,0,255] : ghost.color);
    
    // Draw ghost body
    arc(x, y - tileSize/4, tileSize, tileSize, PI, TWO_PI);
    rect(x - tileSize/2, y - tileSize/4, tileSize, tileSize/2);
    triangle(x - tileSize/2, y + tileSize/4,
             x - tileSize/6, y + tileSize/2,
             x - tileSize/3, y + tileSize/4);
    triangle(x, y + tileSize/4,
             x + tileSize/6, y + tileSize/2,
             x + tileSize/3, y + tileSize/4);
    
    // Draw eyes
    fill(255);
    ellipse(x - tileSize/4, y - tileSize/4, tileSize/4, tileSize/4);
    ellipse(x + tileSize/4, y - tileSize/4, tileSize/4, tileSize/4);
    
    // Draw pupils
    fill(0);
    let pupilOffset = tileSize/16 * (ghost.dirX || ghost.dirY);
    ellipse(x - tileSize/4 + (ghost.dirX ? pupilOffset : 0),
            y - tileSize/4 - (ghost.dirY ? pupilOffset : 0),
            tileSize/8, tileSize/8);
    ellipse(x + tileSize/4 + (ghost.dirX ? pupilOffset : 0),
            y - tileSize/4 - (ghost.dirY ? pupilOffset : 0),
            tileSize/8, tileSize/8);
  }
}

// Update golden ghosts movement
function updateGoldenGhosts() {
  for (let ghost of goldenGhosts) {
    // Skip update if ghost is eaten
    if (ghost.state === 'eaten') continue;
    
    // Apply level-specific speed multiplier
    ghost.progress += speed * ghostSpeed;
    
    if (ghost.progress >= 1) {
      // Determine new target cell with horizontal wrap-around
      let newX = ghost.tileX + ghost.dirX;
      let newY = ghost.tileY + ghost.dirY;
      if (newX < 0) newX = mazeCols - 1;
      if (newX >= mazeCols) newX = 0;
      if (newY < 0 || newY >= mazeRows) newY = ghost.tileY;
      
      ghost.tileX = newX;
      ghost.tileY = newY;
      ghost.progress = 0;
      
      // Recalculate direction at intersections
      let possible = [];
      let dirs = [
        { dirX: 0, dirY: -1 },
        { dirX: 0, dirY: 1 },
        { dirX: -1, dirY: 0 },
        { dirX: 1, dirY: 0 }
      ];
      
      for (let d of dirs) {
        // Do not allow reversing direction
        if (d.dirX === -ghost.dirX && d.dirY === -ghost.dirY) continue;
        let nx = ghost.tileX + d.dirX;
        let ny = ghost.tileY + d.dirY;
        if (nx < 0) nx = mazeCols - 1;
        if (nx >= mazeCols) nx = 0;
        if (ny < 0 || ny >= mazeRows) continue;
        
        // Use a helper that lets ghosts pass if the cell is a ghost door
        if (isPassableForGhost(nx, ny)) {
          possible.push(d);
        }
      }
      
      if (possible.length > 0) {
        if (ghost.state === 'vulnerable') {
          // When vulnerable, move randomly
          let choice = possible[Math.floor(Math.random() * possible.length)];
          ghost.dirX = choice.dirX;
          ghost.dirY = choice.dirY;
        } else {
          // Guard behavior: try to stay close to the fruit
          let target = { x: fruitX, y: fruitY };
          
          // Choose the direction that minimizes distance to target
          let best = possible[0];
          let bestDist = dist(ghost.tileX + best.dirX, ghost.tileY + best.dirY, target.x, target.y);
          
          for (let d of possible) {
            let dDist = dist(ghost.tileX + d.dirX, ghost.tileY + d.dirY, target.x, target.y);
            if (dDist < bestDist) {
              best = d;
              bestDist = dDist;
            }
          }
          
          ghost.dirX = best.dirX;
          ghost.dirY = best.dirY;
        }
      }
    }
  }
}

// Start the hangman game
function startHangman() {
  hangmanActive = true;
  hangmanWrong = 0;
  hangmanGuessed = [];
  
  // Choose a random word
  hangmanWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
}

// Process a guess in the hangman game
function processHangmanGuess(letter) {
  // Ignore already guessed letters
  if (hangmanGuessed.includes(letter)) return;
  
  // Add to guessed letters
  hangmanGuessed.push(letter);
  
  // Check if letter is in the word
  if (!hangmanWord.includes(letter)) {
    hangmanWrong++;
    
    // Check if player has lost
    if (hangmanWrong >= hangmanMaxWrong) {
      endHangmanGame(false);
    }
  }
  
  // Check if player has won
  let allLettersGuessed = true;
  for (let i = 0; i < hangmanWord.length; i++) {
    if (!hangmanGuessed.includes(hangmanWord[i])) {
      allLettersGuessed = false;
      break;
    }
  }
  
  if (allLettersGuessed) {
    endHangmanGame(true);
  }
}

// End the hangman game
function endHangmanGame(won) {
  hangmanActive = false;
  
  if (won) {
    // Make all ghosts disappear for 15 seconds
    ghosts.forEach(g => {
      g.tileX = -10;
      g.tileY = -10;
      g.state = 'eaten';
    });
    
    // Also make golden ghosts disappear
    goldenGhosts.forEach(g => {
      g.tileX = -10;
      g.tileY = -10;
      g.state = 'eaten';
    });
    
    // Set timer for ghosts to return
    ghostVanishTime = 15 * 60; // 15 seconds at 60 FPS
  }
  
  // Remove the fruit and golden ghosts
  fruitActive = false;
  fruitTimer = fruitSpawnTime;
}

// Draw the hangman game
function drawHangman() {
  background(0);
  
  // Draw hangman gallows
  stroke(255);
  strokeWeight(4);
  
  // Base
  line(width/4, height*3/4, width/2, height*3/4);
  // Pole
  line(width/3, height*3/4, width/3, height/4);
  // Top
  line(width/3, height/4, width/2, height/4);
  // Rope
  line(width/2, height/4, width/2, height/3);
  
  // Draw the man based on wrong guesses
  if (hangmanWrong >= 1) {
    // Head
    circle(width/2, height/3 + tileSize/2, tileSize);
  }
  if (hangmanWrong >= 2) {
    // Body
    line(width/2, height/3 + tileSize, width/2, height/2 + tileSize);
  }
  if (hangmanWrong >= 3) {
    // Left arm
    line(width/2, height/2 - tileSize/2, width/2 - tileSize, height/2);
  }
  if (hangmanWrong >= 4) {
    // Right arm
    line(width/2, height/2 - tileSize/2, width/2 + tileSize, height/2);
  }
  if (hangmanWrong >= 5) {
    // Left leg
    line(width/2, height/2 + tileSize, width/2 - tileSize, height/2 + tileSize*2);
  }
  if (hangmanWrong >= 6) {
    // Right leg
    line(width/2, height/2 + tileSize, width/2 + tileSize, height/2 + tileSize*2);
  }
  
  noStroke();
  
  // Draw the word with blanks for unguessed letters
  fill(255);
  textSize(32);
  textAlign(CENTER);
  let displayWord = "";
  for (let i = 0; i < hangmanWord.length; i++) {
    if (hangmanGuessed.includes(hangmanWord[i])) {
      displayWord += hangmanWord[i] + " ";
    } else {
      displayWord += "_ ";
    }
  }
  text(displayWord, width/2, height*3/4 + 40);
  
  // Draw guessed letters
  textSize(16);
  text("Guessed: " + hangmanGuessed.join(", "), width/2, height*3/4 + 80);
  
  // Instructions
  textSize(14);
  text("Press A-Z to guess letters", width/2, height*3/4 + 110);
}
