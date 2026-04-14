import { player } from "../entities/player.js";
import { ctx } from "../core/config.js";
import { spriteOffsetY } from "../core/config.js";
import { gameState } from "../core/game.js";
import { enemiesByScene } from "../entities/enemies.js";
import { dialogueState } from "../ui/dialogue.js";
import { canvas } from "../core/config.js";
import { roundRect } from "../core/utils.js";
import { mouseX, mouseY } from "../core/input.js";


export function drawPlayerHUD() {
  ctx.save();

  const barWidth = 200;
  const barHeight = 20;
  const x = 80;
  const y = 20;

  ctx.lineWidth = 1;

  // --- LEVEL TEXT ---
  ctx.fillStyle = "white";
  ctx.font = "20px 'Press Start 2P'";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`Level ${player.level}`, 20, y); // just above health bar

  // --- HEALTH LABEL ---
  ctx.textBaseline = "top";
  ctx.fillText("HP:", 20, y + 34);

  // --- HEALTH BAR ---
  ctx.fillStyle = "grey";
  ctx.fillRect(x, y + 30, barWidth, barHeight); // background
  ctx.fillStyle = "green";
  const healthWidth = (player.health / player.maxHealth) * barWidth;
  ctx.fillRect(x, y + 30, healthWidth, barHeight); // current health
  ctx.strokeStyle = "black";
  ctx.strokeRect(x, y + 30, barWidth, barHeight); // outline

  // --- HEALTH TEXT INSIDE BAR ---
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.font = "14px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText(
    `${player.health}/${player.maxHealth}`,
    x + barWidth / 2,
    y + 41
  );

  // --- XP LABEL ---
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillStyle = "white";
  ctx.fillText("XP:", 20, y + barHeight + 52);

    // --- XP BAR ---
  const xpBarY = y + barHeight + 50;
  const xpBarHeight = 16; // was 10
  ctx.fillStyle = "grey";
  ctx.fillRect(x, xpBarY, barWidth, xpBarHeight);
  ctx.fillStyle = "blue";
  const xpWidth = (player.xp / player.xpToNextLevel) * barWidth;
  ctx.fillRect(x, xpBarY, xpWidth, xpBarHeight);
  ctx.strokeStyle = "black";
  ctx.strokeRect(x, xpBarY, barWidth, xpBarHeight);

  // --- XP TEXT INSIDE BAR ---
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.font = "12px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText(
    `${player.xp}/${player.xpToNextLevel}`,
    x + barWidth / 2,
    xpBarY + xpBarHeight / 2 + 2
  );


  ctx.textAlign = "left";

  ctx.restore();
}

export function drawLevelUpScreen() {
    if (!gameState.levelUpActive) return;

    const width = 400;
    const height = 200;
    const x = canvas.width / 2 - width / 2;
    const y = canvas.height / 2 - height / 2;

    // --- Background overlay ---
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- Popup box ---
    ctx.fillStyle = "#222";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);

    // --- Text ---
    ctx.fillStyle = "white";
    ctx.font = "20px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = gameState.levelUpMessage.split("\n");
    lines.forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, y + 50 + i * 30);
    });

    // --- Continue instruction ---
    ctx.font = "14px 'Press Start 2P'";
    ctx.fillText("Press ENTER to continue", canvas.width / 2, y + height - 30);
}


export function drawChoiceMenu() {
  if (!dialogueState.choiceActive) return;

  const buttonWidth = 260;
  const buttonHeight = 70;
  const spacing = 150;
  const borderRadius = 12;

  // DARKEN BACKGROUND only while menu is active
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  // Calculate starting x for centering all buttons
  const totalWidth =
    buttonWidth * dialogueState.choices.length +
    spacing * (dialogueState.choices.length - 1);
  let startX = (canvas.width - totalWidth) / 2;
  const startY = canvas.height / 2 - buttonHeight / 2;

  dialogueState.choices.forEach((choice) => {
    // Save rect for click detection
    choice.rect = { x: startX, y: startY, width: buttonWidth, height: buttonHeight };

    // Check hover for this button
    const hover =
      mouseX >= choice.rect.x &&
      mouseX <= choice.rect.x + choice.rect.width &&
      mouseY >= choice.rect.y &&
      mouseY <= choice.rect.y + choice.rect.height;

    // Draw button background
    ctx.fillStyle = "#222222";
    roundRect(ctx, choice.rect.x, choice.rect.y, buttonWidth, buttonHeight, borderRadius, true, true);

    // Draw border
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    roundRect(ctx, choice.rect.x, choice.rect.y, buttonWidth, buttonHeight, borderRadius, false, true);

    // Draw yellow outline glow if hovered
    if (hover) {
      ctx.save();
      ctx.shadowColor = "yellow";
      ctx.shadowBlur = 15;
      ctx.lineWidth = 4;
      ctx.strokeStyle = "yellow";
      roundRect(ctx, choice.rect.x, choice.rect.y, buttonWidth, buttonHeight, borderRadius, false, true);
      ctx.restore();
    }

    // Draw text, wrapped if too wide
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textX = choice.rect.x + buttonWidth / 2;
    const textY = choice.rect.y + buttonHeight / 2;
    wrapAndDrawText(choice.text, textX, textY, buttonWidth - 20, 20, true);

    // Move startX to next button
    startX += buttonWidth + spacing;
  });
}

// Helper for wrapped and vertically centered text
function wrapAndDrawText(text, x, y, maxWidth, lineHeight, center = false) {
  const words = text.split(" ");
  let line = "";
  const lines = [];

  words.forEach((word) => {
    const testLine = line + word + " ";
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  });
  if (line) lines.push(line.trim());

  lines.forEach((lineText, i) => {
    const drawX = x; // always center
    const drawY = y + (i - (lines.length - 1) / 2) * lineHeight; // vertically center multi-line
    ctx.fillText(lineText, drawX, drawY);
  });
}


export function drawEnemyHealthBars() {
  const allEnemies = enemiesByScene[gameState.currentScene] || [];
  allEnemies.forEach(enemy => {
    if (!enemy.active || enemy.state === "dead") return;

    ctx.save();

    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    const barWidth = 40;
    const barHeight = 6;
    const x = enemy.worldX - gameState.cameraX + (enemy.width - barWidth) / 2;

    // --- Adjust y for taller boss ---
    let y = enemy.y + spriteOffsetY + 50; // default for normal enemies

    if (enemy.type === "castleBoss") {
      // push it down a bit so it sits above boss sprite nicely
      y = enemy.y + spriteOffsetY + 100;
    }

    const healthRatio = Math.max(0, Math.min(1, enemy.health / enemy.maxHealth));
    const healthWidth = healthRatio * barWidth;

    // Background
    ctx.fillStyle = "grey";
    ctx.fillRect(x, y, barWidth, barHeight);

    // Health
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, healthWidth, barHeight);

    // Outline
    ctx.strokeStyle = "black";
    ctx.strokeRect(x, y, barWidth, barHeight);

    ctx.restore();
  });
}