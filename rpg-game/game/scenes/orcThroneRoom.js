// scenes/orcThroneRoom.js
import { ctx, canvas, spriteOffsetY } from "../core/config.js";
import { player, updatePlayer } from "../entities/player.js";
import { drawPlayer } from "../ui/gameplayUI.js";
import { gameState } from "../core/game.js";
import { handlePlayerMovement } from "../core/input.js";
import { drawSpeechBubbles, drawDialogueArea } from "../ui/dialogue.js";
import { drawSharedGameplayUI } from "../ui/gameplayUI.js";
import { orcKing, updateOrcKing } from "../entities/npc.js";
import { orcThroneRoom } from "../core/assets.js";

let finalDialogueStarted = false;
let gameEndingTriggered = false;

export function drawOrcThroneRoom() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(orcThroneRoom, 0, 0, canvas.width, canvas.height);

  // --- Draw Orc King ---
  drawNPC(orcKing);

  // --- Draw player ---
  drawPlayer();

  drawSpeechBubbles();
  drawDialogueArea();

  drawSharedGameplayUI();
}

function drawNPC(npc) {
  if (!npc.sprite || npc.state === "gone") return;

  const screenX = npc.worldX;

  ctx.save();

  if (npc.direction === "left") {
    ctx.translate(screenX + npc.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(
      npc.sprite,
      npc.frameX * 100,
      npc.frameY * 100,
      100,
      100,
      0,
      npc.y + spriteOffsetY,
      npc.width,
      npc.height
    );
  } else {
    ctx.drawImage(
      npc.sprite,
      npc.frameX * 100,
      npc.frameY * 100,
      100,
      100,
      screenX,
      npc.y + spriteOffsetY,
      npc.width,
      npc.height
    );
  }

  ctx.restore();
}

export function updateOrcThroneRoom() {
    // NO camera handling here
    handlePlayerMovement("throneRoom");
  
    updatePlayer(player);
    updateOrcKing();
  
    if (orcKing.dialogueFinished && window.keys?.Enter) {
      triggerGameEnding();
    }
  }
  
  function triggerGameEnding() {
    if (gameEndingTriggered) return;
  
    gameEndingTriggered = true;
  
    gameState.gameWon = true;
    gameState.fadeActive = true;
    gameState.fadeDirection = 1;
  }