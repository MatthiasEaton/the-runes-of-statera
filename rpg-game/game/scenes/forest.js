import { player, updatePlayer } from "../entities/player.js";
import { orcs, armoredOrcs, drawOrc } from "../entities/orc.js";
import { updatePriest, drawPriest, runes } from "../entities/npc.js";
import { canvas, ctx } from "../core/config.js";
import { keys, handlePlayerMovement } from "../core/input.js";
import { background } from "../core/assets.js";
import { drawDialogueArea, drawSpeechBubbles } from "../ui/dialogue.js";
import { drawTree } from "../world/map.js";
import { drawSharedGameplayUI } from "../ui/gameplayUI.js";
import { gameState } from "../core/game.js";



// draw everything
export function drawForest() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);



  if (background.complete) {
    const bgWidth = canvas.width;
    const bgX = gameState.cameraX % bgWidth;

    ctx.drawImage(background, -bgX, 0, bgWidth, canvas.height);
    ctx.drawImage(background, -bgX + bgWidth, 0, bgWidth, canvas.height);
  }


  // --- Draw trees ---
  drawTree();


  drawPriest();


  

  const RUNE_SCALE = 4; // scale factor

for (let rune of runes) {
  if (!rune.collected) {
    const runeScreenX = rune.worldX - gameState.cameraX;
    ctx.drawImage(
      rune.sprite,
      0, 0, rune.sprite.width, rune.sprite.height, // source rectangle
      runeScreenX, rune.y,                           // destination top-left
      rune.width * RUNE_SCALE, rune.height * RUNE_SCALE // scaled width & height
    );
  }
}


  const allOrcs = [...orcs, ...armoredOrcs];
  for (let orc of allOrcs) {
    drawOrc(ctx, orc);
  }


  drawSharedGameplayUI();

  drawSpeechBubbles();

  drawDialogueArea();

}

// Game loop
export function updateForest() {
updatePlayer();
updatePriest();
handlePlayerMovement("forest");

  // --- Background scrolling ---
const screenEdge = canvas.width * 0.3; // how far from edge before background moves

if (keys.ArrowRight && player.worldX > screenEdge) {
  gameState.bgX += player.speed;
  if (gameState.bgX >= canvas.width) gameState.bgX = 0;
}

if (keys.ArrowLeft && player.worldX < canvas.width - screenEdge) {
  gameState.bgX -= player.speed;
  if (gameState.bgX <= -canvas.width) gameState.bgX = 0;
}

    // Orc animations
    orcs.forEach(orc => {
      if (!orc.active) return;
      if (orc.state === "walk" || orc.state === "attack") {
        orc.frameTimer++;
        if (orc.frameTimer >= orc.frameInterval) {
          orc.frameTimer = 0;
          orc.frameX = (orc.frameX + 1) % orc.maxFrames;
        }
      }
    });

}

