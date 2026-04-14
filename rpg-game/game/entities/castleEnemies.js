import { groundY, spriteOffsetY } from "../core/config.js";
import { player } from "../entities/player.js";
import { gainXP } from "../entities/player.js";
import { armoredAxemanSprite, knight2Sprite } from "../core/assets.js";
import { gameState } from "../core/game.js";

// --- Animations for castle enemies ---
export const minionActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
  attack: { row: 2, frames: 9 },
  hurt: { row: 5, frames: 4 },
  death: { row: 6, frames: 4 }
};

export const bossActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
  attack: { row: 2, frames: 7 },
  hurt: { row: 6, frames: 4 },
  death: { row: 7, frames: 4 }
};

// --- Enemy positions ---
export const minionPositions = [2000, 2300, 3400, 3600, 4400, 4600, 5400, 6200, 6500, 6800, 6900, 7300, 7600, 7900, 8600, 8700, 8900, 9400, 10000, 10300, 10500, 10600, 10700];
export const bossPosition = 14500;

// --- Create minion ---
export function createMinion(worldX) {
  return {
    type: "castleMinion",
    worldX,
    startX: worldX,
    y: groundY - 300 - spriteOffsetY,
    width: 300,
    height: 300,
    speed: 1.6,
    frameX: 0,
    frameY: minionActions.idle.row,
    maxFrames: minionActions.idle.frames,
    active: false,
    attacking: false,
    sprite: armoredAxemanSprite,
    frameTimer: 0,
    frameInterval: 5,
    maxHealth: 100,
    health: 100,
    attackDamage: 20,
    fadeOut: 0,
    deadComplete: false,
    isAttacking: false,
    attackHit: false,
    state: "idle",
    xpGiven: false,
    direction: "left",
    actions: minionActions,
  };
}

// --- Create boss ---
export function createBoss(worldX) {
  return {
    type: "castleBoss",
    worldX,
    startX: worldX,
    y: groundY - 340 - spriteOffsetY,
    width: 380,
    height: 380,
    speed: 1.5,
    frameX: 0,
    frameY: bossActions.idle.row,
    maxFrames: bossActions.idle.frames,
    active: false,
    attacking: false,
    sprite: knight2Sprite,
    frameTimer: 0,
    frameInterval: 8,
    maxHealth: 360,
    health: 360,
    attackDamage: 30,
    fadeOut: 0,
    deadComplete: false,
    isAttacking: false,
    attackHit: false,
    state: "idle",
    xpGiven: false,
    boss: true,
    actions: bossActions,
    showBubble: false,  // no words
    dialogueFinished: true, 
    direction: "left"
  };
}

// --- Arrays ---
export const minions = minionPositions.map(pos => createMinion(pos));
export const boss = createBoss(bossPosition);

// Draw function
export function drawCastleEnemy(ctx, enemy) {
    if (enemy.state === "dead" && enemy.deadComplete) return;
  
    const screenX = enemy.worldX - gameState.cameraX;
  
    ctx.save();
    if (enemy.state === "dead" && enemy.fadeOut !== undefined) {
      ctx.globalAlpha = 1 - enemy.fadeOut;
    }
  
    if (enemy.direction === "left") {
      ctx.translate(screenX + enemy.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(
        enemy.sprite,
        enemy.frameX * 100,
        enemy.frameY * 100,
        100, 100,
        0,
        enemy.y + spriteOffsetY,
        enemy.width,
        enemy.height
      );
    } else {
      ctx.drawImage(
        enemy.sprite,
        enemy.frameX * 100,
        enemy.frameY * 100,
        100, 100,
        screenX,
        enemy.y + spriteOffsetY,
        enemy.width,
        enemy.height
      );
    }
    ctx.restore();
  }

// --- Update function ---
export function updateCastleEnemies() {
  const attackDistance = 40;
  const allEnemies = [...minions, boss];

  allEnemies.forEach(enemy => {
    // --- Animate idle/walk frames ---
    if (enemy.state === "idle" || enemy.state === "walk") {
      enemy.frameTimer++;
      if (enemy.frameTimer >= enemy.frameInterval) {
        enemy.frameTimer = 0;
        enemy.frameX++;
        if (enemy.frameX >= enemy.maxFrames) enemy.frameX = 0;
      }
    }

    // --- Skip dead + fully faded ---
    if (enemy.state === "dead" && enemy.deadComplete) return;

    // --- Activate minions ---
    if (!enemy.active) {
      if (Math.abs(player.worldX - enemy.worldX) < 300) {
        enemy.active = true;
      } else {
        return;
      }
    }

    const distance = player.worldX - enemy.worldX;

    // --- Death handling ---
    if (enemy.state === "dead") {
      if (!enemy.xpGiven) {
        gainXP(enemy.boss ? 75 : 30);
        enemy.xpGiven = true;
      }
      if (!enemy.deadComplete) {
        enemy.frameTimer++;
        if (enemy.frameTimer >= enemy.frameInterval) {
          enemy.frameTimer = 0;
          if (enemy.frameX < enemy.maxFrames - 1) enemy.frameX++;
          else {
            if (!enemy.fadeOut) enemy.fadeOut = 0;
            enemy.fadeOut += 1 / 30;
            if (enemy.fadeOut >= 1) enemy.deadComplete = true;
          }
        }
      }
      return;
    }

    // --- Face player ---
    enemy.direction = distance < 0 ? "left" : "right";

    // --- Attack or walk ---
    if (Math.abs(distance) <= attackDistance) {
      enemy.state = "attack";
      enemy.attacking = true;
      const actionSet = enemy.boss ? bossActions : minionActions;
      enemy.frameY = actionSet.attack.row;
      enemy.maxFrames = actionSet.attack.frames;

      // Animate attack frames
      enemy.frameTimer++;
      if (enemy.frameTimer >= enemy.frameInterval) {
        enemy.frameTimer = 0;
        enemy.frameX++;

        // Damage player on last frame
        if (!enemy.attackHit && enemy.frameX === enemy.maxFrames - 1 && !player.isDead) {
          const skelLeft = enemy.worldX;
          const skelRight = enemy.worldX + enemy.width;
          const playerLeft = player.worldX;
          const playerRight = player.worldX + player.width;
          if (skelRight > playerLeft && skelLeft < playerRight) {
            player.health -= enemy.attackDamage;
            player.health = Math.max(0, player.health);
            enemy.attackHit = true;
          }
        }

        // Reset attackHit once animation loops
        if (enemy.frameX >= enemy.maxFrames) {
          enemy.frameX = 0;
          enemy.attackHit = false;
        }
      }
    } else {
      // Walk toward player
      enemy.state = "walk";
      enemy.attacking = false;
      enemy.attackHit = false;

      const actionSet = enemy.boss ? bossActions : minionActions;
      enemy.frameY = actionSet.walk.row;
      enemy.maxFrames = actionSet.walk.frames;

      const moveDir = distance > 0 ? 1 : -1;
      enemy.worldX += enemy.speed * moveDir;
    }

    // --- Adjust animation speed ---
    if (enemy.boss) enemy.frameInterval = enemy.state === "attack" ? 10 : 3;
    else enemy.frameInterval = enemy.state === "attack" ? 16 : 5;
  });
}