import { ctx, canvas, spriteOffsetY, inventoryUI } from "../core/config.js";
import { player } from "../entities/player.js";
import { inventoryVariables, bagPadding, bagSize, drawInventoryCloseButton, drawInventoryItems, drawDiscardModal, drawInventory} from "./inventory.js";
import { gameState } from "../core/game.js";
import { drawDialogueUI } from "./dialogue.js";
import { drawPlayerHUD, drawEnemyHealthBars } from "./hud.js";
import { bagIcon, inventoryImg } from "../core/assets.js";
import { mouseX, mouseY } from "../core/input.js";
import { drawSettings } from "./settings.js";
import { gearIcon } from "../core/assets.js";

export function drawPlayer() {

    if (!player.sprite) return

  const screenX = player.worldX - gameState.cameraX;
  ctx.save();
  if (player.direction === "left") {
    ctx.translate(screenX + player.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(player.sprite, player.frameX * 100, player.frameY * 100, 100, 100, 0, player.y + spriteOffsetY, player.width, player.height);
  } else {
    ctx.drawImage(player.sprite, player.frameX * 100, player.frameY * 100, 100, 100, screenX, player.y + spriteOffsetY, player.width, player.height);
  }
  ctx.restore();
}

export function drawInventoryUI() {
  const iconGap = 20;

  // --- Settings icon ---
const settingsX = canvas.width - bagPadding - bagSize * 2 - iconGap;
const settingsY = bagPadding;

// Hover glow
if (
  mouseX >= settingsX &&
  mouseX <= settingsX + bagSize &&
  mouseY >= settingsY &&
  mouseY <= settingsY + bagSize
) {
  ctx.shadowColor = "yellow";
  ctx.shadowBlur = 20;
} else {
  ctx.shadowBlur = 0;
}

// Draw icon
ctx.drawImage(gearIcon, settingsX, settingsY, bagSize, bagSize);

// Reset shadow
ctx.shadowBlur = 0;

// --- Inventory bag icon glow ---
  if (
    mouseX >= canvas.width - bagPadding - bagSize &&
    mouseX <= canvas.width - bagPadding &&
    mouseY >= bagPadding &&
    mouseY <= bagPadding + bagSize
  ) {
    ctx.shadowColor = "yellow";
    ctx.shadowBlur = 20;
  } else {
    ctx.shadowBlur = 0;
  }
  ctx.drawImage(bagIcon, canvas.width - bagPadding - bagSize, bagPadding, bagSize, bagSize);
  ctx.shadowBlur = 0;


  // --- Inventory open ---
  if (inventoryVariables.inventoryOpen) {
    // Dark semi-transparent overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Inventory background
    ctx.drawImage(inventoryImg, inventoryUI.x, inventoryUI.y, inventoryUI.width, inventoryUI.height);

    // Inventory close button
    drawInventoryCloseButton();

    // Draw inventory items
    drawInventoryItems();

    // Draw discard modal if an item is selected
    drawDiscardModal();
  }
}

export function drawLevelUpScreen() {
  ctx.save();
    const overlayWidth = 400;
    const overlayHeight = 300;
    const x = (canvas.width - overlayWidth) / 2;
    const y = (canvas.height - overlayHeight) / 2;

    // Semi-transparent background
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Level-up box
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, overlayWidth, overlayHeight);

    // Border
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, overlayWidth, overlayHeight);

    // Level-up text
    ctx.fillStyle = "white";
    ctx.font = "24px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText(`Level Up!`, canvas.width / 2, y + 50);
    ctx.fillText(`Level ${player.level}`, canvas.width / 2, y + 90);
    ctx.fillText(`HP +10`, canvas.width / 2, y + 130);
    ctx.fillText(`Attack + 5`, canvas.width / 2, y + 160);

    ctx.font = "16px 'Press Start 2P'";
    ctx.fillText("Press Enter to continue", canvas.width / 2, y + overlayHeight - 20);
  ctx.restore();
}

export function drawGameOverScreen() {
  if (!gameState.gameOver) return;

  ctx.save();
  ctx.font = "64px 'Press Start 2P'";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

  ctx.font = "16px 'Press Start 2P'";
  ctx.fillStyle = "white";
  ctx.fillText("Click anywhere to restart", canvas.width / 2, canvas.height / 2 + 40);
  ctx.restore();
}

export function drawSharedGameplayUI() {
  // Player
  drawPlayer();

  // Game over screen
  if (gameState.gameOver) {
    drawGameOverScreen();
    return;
  }

  // Dialogue
  drawDialogueUI();

  

  

  // HUD
  drawPlayerHUD();
  drawEnemyHealthBars();

  // Inventory UI
  drawInventory();
  if (inventoryVariables.inventoryOpen) {
  }
  drawInventoryUI();

  // Settings
  drawSettings(ctx);

  // Level up
  if (gameState.levelUpActive) {
    drawLevelUpScreen();
    return; // overlay
  }
}

export function handleLevelUpScreen() {
  if (!gameState.levelUpActive) return false; // not active, continue game loop

  drawLevelUpScreen(); // render the overlay

  return true; // signal that gameplay should be paused
}
