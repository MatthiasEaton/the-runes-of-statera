import { ctx, canvas } from "../core/config.js";
import { castleBackground } from "../core/assets.js"; // your new castle background
import { player, updatePlayer } from "../entities/player.js";
import { setScene } from "../core/sceneManager.js";
import { drawPlayer } from "../ui/gameplayUI.js";
import { updateNPCs } from "../entities/npc.js";
import { gameState } from "../core/game.js";
import { drawSharedGameplayUI } from "../ui/gameplayUI.js";
import { handlePlayerMovement } from "../core/input.js";
import { drawSpeechBubbles, drawDialogueArea } from "../ui/dialogue.js";
import { drawCastleNPC, updateCastleNPC } from "../entities/npc.js";
import { drawCastleEnemy, updateCastleEnemies, minions, boss } from "../entities/castleEnemies.js";

// --- DRAW ---
export function drawCastle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // --- Background scrolling ---
    if (castleBackground.complete) {
      const bgWidth = canvas.width;
      const bgX = gameState.cameraX % bgWidth;
  
      ctx.drawImage(castleBackground, -bgX, 0, bgWidth, canvas.height);
      ctx.drawImage(castleBackground, -bgX + bgWidth, 0, bgWidth, canvas.height);
    }

  // --- Draw NPCs ---
  drawCastleNPC();


  // --- Draw player ---
  drawPlayer();

    // --- Draw castle enemies ---
    [...minions, boss].forEach(enemy => drawCastleEnemy(ctx, enemy));

  // --- Dialogue and speech bubbles ---
  drawSpeechBubbles();
  drawDialogueArea();

  // --- Shared gameplay UI (HUD, inventory, etc.) ---
  drawSharedGameplayUI();
}

// --- UPDATE ---
let dialogueFinished = false;

export function updateCastle() {
  updateNPCs();
  updateCastleNPC();
  updateCastleEnemies();
  handlePlayerMovement("forest");
  updatePlayer(player);


  if (dialogueFinished && window.keys.Enter) {
    setScene("forest3");
  }
}