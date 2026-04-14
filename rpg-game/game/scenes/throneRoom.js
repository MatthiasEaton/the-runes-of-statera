// scenes/throneRoom.js
import { ctx, canvas, spriteOffsetY } from "../core/config.js";
import { throneBackground } from "../core/assets.js";
import { player, updatePlayer } from "../entities/player.js";
import { setScene } from "../core/sceneManager.js";
import { drawPlayer } from "../ui/gameplayUI.js";
import { knightTemplar, king, updateNPCs } from "../entities/npc.js";
import { gameState } from "../core/game.js";
import { drawSharedGameplayUI } from "../ui/gameplayUI.js";
import { handlePlayerMovement } from "../core/input.js";
import { drawSpeechBubbles, drawDialogueArea } from "../ui/dialogue.js";


let finalDialogueStarted = false;
let gameEndingTriggered = false;

export function drawThroneRoom() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

if (throneBackground.complete) {
    ctx.drawImage(throneBackground, 0, 0, canvas.width, canvas.height);
}

// --- Draw NPCs ---
drawNPC(king, "throneRoom");

if (gameState.storyProgress !== "postCastleBoss") {
  knightTemplar.forEach(knight => drawNPC(knight, "throneRoom"));
}

  // --- Draw player ---
  drawPlayer();

  drawSpeechBubbles();
  drawDialogueArea();

  // --- Draw shared UI (HUD, inventory, dialogue, level-up, game-over) ---
  drawSharedGameplayUI();
}

// draw NPC
function drawNPC(npc, scene) {
  if (!npc.sprite || npc.state === "gone") return;

  const screenX = scene === "forest" ? npc.worldX - gameState.cameraX : npc.worldX;
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

function triggerGameEnding() {
  if (gameEndingTriggered) return;
  gameEndingTriggered = true;

  gameState.gameWon = true;
  gameState.fadeActive = true;
  gameState.fadeDirection = 1;
}

export function updateThroneRoom() {
  handlePlayerMovement("throneRoom");
  updatePlayer(player);

  // --- ALT ENDING: RETURN WITH RUNES ---
  if (gameState.storyProgress === "postRunesCollected") {
    updateNPCs();

    king.dialogue = king.returnWithRunesDialogue;

    if (king.dialogueFinished && window.keys?.Enter) {
      triggerGameEnding();
    }
  }

  // --- MAIN ENDING: KING DEFEATED ---
  else if (gameState.storyProgress === "postCastleBoss") {
    updateNPCs();

    king.dialogue = king.finalDialogue;

    if (king.dialogueFinished && window.keys?.Enter) {
      triggerGameEnding();
    }
  }

  // --- DEFAULT (everything else) ---
  else {
    updateNPCs();

    king.dialogue = king.introDialogue;

    if (king.dialogueFinished && window.keys?.Enter) {
      setScene("forest");
    }
  }
}
