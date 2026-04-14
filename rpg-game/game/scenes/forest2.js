import { player, updatePlayer } from "../entities/player.js";
import { skeletons, armoredSkeletons, drawSkeleton, updateSkeletons } from "../entities/skeleton.js";
import { updateArcher, drawArcher, runes, updateWizard, drawWizard } from "../entities/npc.js";
import { canvas, ctx } from "../core/config.js";
import { keys, handlePlayerMovement } from "../core/input.js";
import { forestBackground2 } from "../core/assets.js";
import { drawTree } from "../world/map.js";
import { drawPlayer, drawGameOverScreen } from "../ui/gameplayUI.js";
import { drawPlayerHUD, drawEnemyHealthBars, drawChoiceMenu } from "../ui/hud.js";
import { drawDialogueArea, drawSpeechBubbles, dialogueState } from "../ui/dialogue.js";
import { gameState } from "../core/game.js";
import {attackEnemies} from "../core/combat.js";


// --- Draw function ---
export function drawForest2() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);


if (dialogueState.choiceActive) {
  drawChoiceMenu(gameState.mouseX, gameState.mouseY);
}

  // Draw background
  if (forestBackground2.complete) {
    const bgWidth = canvas.width;
    const bgX = gameState.cameraX % bgWidth;

    ctx.drawImage(forestBackground2, -bgX, 0, bgWidth, canvas.height);
    ctx.drawImage(forestBackground2, -bgX + bgWidth, 0, bgWidth, canvas.height);
  }

  // Draw trees
  drawTree();

  // Draw NPCs
  drawArcher();

  drawWizard();
  // Draw player
  drawPlayer();

  // Draw runes
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

  // Draw skeletons
  const allSkeletons = [...skeletons, ...armoredSkeletons];
for (let skel of allSkeletons) {
  drawSkeleton(ctx, skel);
}

  // Game over / UI
  drawGameOverScreen();
  drawSpeechBubbles();
  drawDialogueArea();
  drawChoiceMenu();

  // Health bars
  drawPlayerHUD();
  drawEnemyHealthBars();
}

// --- Update function ---
export function updateForest2() {
  // Player logic
  updatePlayer();
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

  // Skeleton AI & combat
  updateSkeletons();
  attackEnemies();

  // Skeleton animations
[...skeletons, ...armoredSkeletons].forEach(skel => {
  if (!skel.active) return;
  if (skel.state === "walk" || skel.state === "attack") {
    skel.frameTimer++;
    if (skel.frameTimer >= skel.frameInterval) {
      skel.frameTimer = 0;
      skel.frameX = (skel.frameX + 1) % skel.maxFrames;
    }
  }
});

  // NPCs
  updateArcher();
  updateWizard();
}

export function resetForest2Scene() {
  // Reset orcs to their ORIGINAL values
  skeletons.forEach(skeleton => {
    skeleton.worldX = skeleton.startX; // ✅ important
    skeleton.health = skeleton.maxHealth;
    skeleton.state = "idle";
    skeleton.frameX = 0;
    skeleton.frameY = orcActions.idle.row;
    skeleton.maxFrames = orcActions.idle.frames;
    skeleton.active = false;
    skeleton.attacking = false;
    skeleton.attackHit = false;
    skeleton.fadeOut = 0;
    skeleton.deadComplete = false;
  });
}