import { player } from "../entities/player.js";
import { playerActions } from "../entities/player.js";
import { handlePlayerMovement } from "../core/input.js";
import { setScene } from "../core/sceneManager.js";
import { ctx, canvas } from "../core/config.js";
import { resetCurrentSceneEnemies } from "../entities/enemies.js";
import { resetGameStateForNewRun } from "../scenes/credits.js";


// ===========================
// Globals (local to game.js)
// ===========================
export const gameState = {
    currentScene: "startScreen", 
    bgX: 0,
    cameraX: 0,
    frameTimer: 0,
    gameOver: false,
    frameInterval: 10,
    levelUpActive: false,
    levelUpMessage: "",

    fadeActive: false,
    fadeTexture: "",
    fadeTextTimer: 0,
    fadeTextDuration: 400,
    fadeTextActive: false,
    fadeText: "",
    fadeTextScene: null,
    fadeTextOpacity: 0,
    fadeOpacity: 0,
    fadeDirection: 1,
    fadeSpeed: 0.018,
    nextScene: null,
    isLocked: false,
    storyProgress: "start"
}

export let unlocked = false;

function unlockAudio() {
  if (!unlocked) {
    unlocked = true;

    // 🎧 Start whatever scene you're currently on
    setScene(gameState.currentScene);
  }
}

window.addEventListener("click", unlockAudio, { once: true });
window.addEventListener("keydown", unlockAudio, { once: true });


// Game Class

export class Game {
  start() {
    console.log("Game starting...");
  }
}


// Game Functions

export function restartGame() {
  loadCheckpoint();

  // --- Player reset ---
  player.health = player.maxHealth;

  player.isDead = false;
  player.deathAnimationDone = false;
  player.isAttacking = false;

  player.state = "idle";
  player.frameX = 0;
  player.frameY = playerActions.idle.row;

  player.vx = 0;
  player.vy = 0;

  // 🔥 FORCE spawn position here
  player.worldX = 100;

  // --- Game state reset ---
  gameState.gameOver = false;

  // 🔥 camera should follow new player position
  gameState.cameraX = 0

  // --- Enemies ---
  resetCurrentSceneEnemies(gameState.currentScene);
}

export function loadCheckpoint() {
  if (!gameState.checkpoint) return;

  const cp = gameState.checkpoint;

  gameState.currentScene = cp.scene;
  player.worldX = cp.playerX;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, opacity = 1) {
  const words = text.split(' ');
  let line = '';
  let lines = [];

  // Split text into lines
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  // Draw each line with golden gradient
  for (let i = 0; i < lines.length; i++) {
    const lineY = y + i * lineHeight;

    // Golden gradient
    const gradient = ctx.createLinearGradient(0, lineY - 20, 0, lineY + 20);
    gradient.addColorStop(0, `rgba(247,225,153,${opacity})`); // pale gold
    gradient.addColorStop(0.5, `rgba(224,192,104,${opacity})`); // darker gold
    gradient.addColorStop(1, `rgba(247,225,153,${opacity})`);

    ctx.fillStyle = gradient;
    ctx.fillText(lines[i], x, lineY);
  }
}




export function drawFade() {
  if (!gameState.fadeActive) return;

  // --- Phase 1: fade to black ---
  if (!gameState.fadeTextActive) {
    gameState.fadeOpacity += gameState.fadeDirection * gameState.fadeSpeed;
  }

  // Clamp opacity at max
  if (gameState.fadeOpacity >= 1 && !gameState.fadeTextActive) {
    gameState.fadeOpacity = 1;

    gameState.isLocked = true;
  
    if (gameState.nextScene) {
      setScene(gameState.nextScene);
  
      // ONLY reset if we're returning to start screen
      if (gameState.nextScene === "startScreen") {
        resetGameStateForNewRun();
      }
  
      gameState.nextScene = null;
    }

    // Pick fade text based on origin scene (saved earlier)
    if (gameState.fadeTextScene === "throneRoom") {
      gameState.fadeText =
        "Through duty and honor, you march into the ancient silence of the woods.";
    } else if (gameState.fadeTextScene === "runeCollected") {
      gameState.fadeText = "You push onward; shadows lengthen as the trees close in, and a thick fog swallows the light.";
    }
    else if (gameState.fadeTextScene === "forestPath") {
      gameState.fadeText = "With the king’s quest in your heart, you venture deeper into the forest… determined to gather the runes and see his will fulfilled.";
    }
    else if (gameState.fadeTextScene === "castlePath") {
      gameState.fadeText = "Having learned the king’s true intentions, you stand with the forest’s guardians… and march together toward the kingdom to end his rule.";
    }
    else if (gameState.fadeTextScene === "kingEncounter") {
      gameState.fadeText = "After defeating the King's forces, you make your way to the throne room and stand before the king...";
    }
    else if (gameState.fadeTextScene === "ending") {
      gameState.fadeText = "The forest and all of its inhabitants have been saved thanks to your valor!";
    }
    else if (gameState.fadeTextScene === "rune3Collected") {
      gameState.fadeText = "After defeating the army of the forest, you find your way to the orc's layer where you face the orc king.";
    }
    else if (gameState.fadeTextScene === "returningWithRune") {
      gameState.fadeText = "You return to the castle with the final rune in hand.";
    }
    else if (gameState.fadeTextScene === "ending2") {
      gameState.fadeText = "Now bound to the king, the runes offer no resistance to his ambition. The forest is consumed, and his conquest is absolute.";
    }
    else if (gameState.fadeTextScene === "introText") {
      gameState.fadeText = "The King has summoned you to his castle.";
    }


    // Activate text phase
    gameState.fadeTextActive = true;
    gameState.fadeTextTimer = 0;
    gameState.fadeTextDuration = 400;
    gameState.fadeTextOpacity = 0;
  }

  // Draw overlay first (keeps text visible)
  ctx.fillStyle = `rgba(0, 0, 0, ${gameState.fadeOpacity})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // --- Phase 2: fade text in/out ---
  if (gameState.fadeTextActive) {
    gameState.fadeTextTimer++;

    const half = gameState.fadeTextDuration / 2;
    if (gameState.fadeTextTimer <= half) {
      // fade in
      gameState.fadeTextOpacity = gameState.fadeTextTimer / half;
    } else if (gameState.fadeTextTimer <= gameState.fadeTextDuration) {
      // fade out
      gameState.fadeTextOpacity =
        1 - (gameState.fadeTextTimer - half) / half;
    } else {
      // Done with text, fade scene back in
      gameState.fadeTextActive = false;
      gameState.fadeDirection = -1;
    }

    // Draw text in middle
    ctx.save();
ctx.font = "26px Uncial Antiqua, serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

// Pass fadeTextOpacity to wrap text function
drawWrappedText(
  ctx,
  gameState.fadeText,
  canvas.width / 2,
  canvas.height / 2,
  canvas.width * 0.8,
  32,
  gameState.fadeTextOpacity
);

ctx.restore();


  }

  // --- Phase 3: fade back in ---
  if (gameState.fadeOpacity <= 0 && !gameState.fadeTextActive) {
    gameState.fadeOpacity = 0;
    gameState.fadeActive = false;

    gameState.isLocked = false;
  }
}


export function updateGame() {

  if (player.deathAnimationDone && !gameState.gameOver) {
    console.log("SETTING GAME OVER");
    gameState.gameOver = true;
  }

  if (gameState.gameOver) {
    return;
  }

  if (gameState.isLocked) {
    return;
  }

  // Only update game logic if not in fade-out to black
  if (!gameState.fadeActive || gameState.fadeDirection === -1) {
    if (!player.isDead) {
      handlePlayerMovement();
      
    }
  }
}
