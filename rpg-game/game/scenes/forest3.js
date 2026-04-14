// forest3.js
import { player, updatePlayer } from "../entities/player.js";
import { runes, updateLancer, drawLancer } from "../entities/npc.js"; // or new NPCs
import { canvas, ctx } from "../core/config.js";
import { keys, handlePlayerMovement } from "../core/input.js";
import { forestBackground3 } from "../core/assets.js"; // your new background
import { drawTree } from "../world/map.js";
import { drawPlayerHUD, drawEnemyHealthBars } from "../ui/hud.js";
import { drawDialogueArea, drawSpeechBubbles } from "../ui/dialogue.js";
import { drawPlayer, drawGameOverScreen } from "../ui/gameplayUI.js";
import { gameState } from "../core/game.js";
import { wereWolfs, werebears, drawWereWolf, updateWereWolfs } from "../entities/forest3Enemies.js";

// --- DRAW ---
export function drawForest3() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  if (forestBackground3.complete) {
    const bgWidth = canvas.width;
    const bgX = gameState.cameraX % bgWidth;

    ctx.drawImage(forestBackground3, -bgX, 0, bgWidth, canvas.height);
    ctx.drawImage(forestBackground3, -bgX + bgWidth, 0, bgWidth, canvas.height);
  }

  // Trees
  drawTree();

  // NPCs 
  drawLancer();

  // Player
  drawPlayer();

  // Runes 
  const RUNE_SCALE = 4;
  for (let rune of runes) {
    if (!rune.collected) {
      const runeScreenX = rune.worldX - gameState.cameraX;
      ctx.drawImage(
        rune.sprite,
        0, 0, rune.sprite.width, rune.sprite.height,
        runeScreenX, rune.y,
        rune.width * RUNE_SCALE, rune.height * RUNE_SCALE
      );
    }
  }

// Draw wereWolfs
const allWereWolfs = [...wereWolfs, ...werebears];
for (let wereWolf of allWereWolfs) {
  drawWereWolf(ctx, wereWolf);
}

  drawGameOverScreen();
  drawSpeechBubbles();
  drawDialogueArea();

  // HUD
  drawPlayerHUD();
  drawEnemyHealthBars();
}

// --- UPDATE ---
export function updateForest3() {
  updateLancer();
  updatePlayer();
  updateWereWolfs();
  handlePlayerMovement("forest");

  // Background scrolling
  const screenEdge = canvas.width * 0.3;

  if (keys.ArrowRight && player.worldX > screenEdge) {
    gameState.bgX += player.speed;
    if (gameState.bgX >= canvas.width) gameState.bgX = 0;
  }

  if (keys.ArrowLeft && player.worldX < canvas.width - screenEdge) {
    gameState.bgX -= player.speed;
    if (gameState.bgX <= -canvas.width) gameState.bgX = 0;
  }
}