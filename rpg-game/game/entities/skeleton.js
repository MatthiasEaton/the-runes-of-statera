import { groundY, spriteOffsetY } from "../core/config.js";
import { skeletonSprite, armoredSkeletonSprite } from "../core/assets.js";
import { player } from "../entities/player.js";
import { gameState } from "../core/game.js";
import { gainXP } from "../entities/player.js";

// --- Skeleton animations ---
export const skeletonActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 9 },
  attack: { row: 2, frames: 6 },
  hurt: { row: 5, frames: 4 },
  death: { row: 6, frames: 4 }
};

export const armoredSkeletonActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
  attack: { row: 2, frames: 8 },
  hurt: { row: 6, frames: 4 },
  death: { row: 7, frames: 4 }
};

// --- Skeleton positions ---
export const skeletonPositions = [2000, 3500, 4500, 5000, 5500, 6200, 6500, 7500, 8500, 9000, 9500, 9800, 10000, 10500, 10700, 11000, 11500, 11700, 12000];
export const armoredSkeletonPositions = [14500];

// --- Skeleton creation functions ---
export function createSkeleton(worldX) {
  return {
    type: "skeleton",
    worldX,
    startX: worldX,
    y: groundY - 300 - spriteOffsetY,
    width: 300,
    height: 300,
    speed: 1.8,
    frameX: 0,
    frameY: skeletonActions.idle.row,
    maxFrames: skeletonActions.idle.frames,
    active: false,
    attacking: false,
    sprite: skeletonSprite,
    frameTimer: 0,
    frameInterval: 4,
    maxHealth: 90,
    health: 90,
    attackDamage: 15,
    fadeOut: 0,
    deadComplete: false,
    isAttacking: false,
    attackHit: false,
    state: "idle",
    xpGiven: false,
    actions: skeletonActions,
  };
}

export function createArmoredSkeleton(worldX) {
  return {
    type: "armoredSkeleton",
    name: "armoredSkeleton",
    worldX,
    startX: worldX, // ✅ important
    y: groundY - 300 - spriteOffsetY,
    width: 300,
    height: 300,
    speed: 1.4,
    frameX: 0,
    frameY: armoredSkeletonActions.idle.row,
    maxFrames: armoredSkeletonActions.idle.frames,
    active: false,
    attacking: false,
    sprite: armoredSkeletonSprite,
    frameTimer: 0,
    frameInterval: 4,
    maxHealth: 280,
    health: 280,
    attackDamage: 28,
    fadeOut: 0,
    deadComplete: false,
    isAttacking: false,
    attackHit: false,
    state: "idle",
    xpGiven: false,
    direction: "left",
    boss: true,
    runeDropped: false,
    actions: armoredSkeletonActions,
    showBubble: true,
    dialogueFinished: false,
    dialogue: [
      { text: "You carry out the king's will… just as I once did.", type: "speaker", speaker: "Skeleton Captain" },
      { text: "We were told the runes would protect the kingdom.", type: "speaker", speaker: "Skeleton Captain" },
      { text: "That they were a threat in the wrong hands.", type: "speaker", speaker: "Skeleton Captain" },
      { text: "…But something never felt right.", type: "speaker", speaker: "Skeleton Captain" },
      { text: "The deeper we went, the more the truth slipped through.", type: "speaker", speaker: "Skeleton Captain" },
      { text: "Men questioned orders… and vanished.", type: "speaker", speaker: "Skeleton Captain" },
      { text: "I stayed loyal... for a time.", type: "speaker", speaker: "Skeleton Captain" },
      { text: "In the end, the truth was revealed.", type: "speaker", speaker: "Skeleton Captain" },
      { text: "I will not let you destroy what is sacred.", type: "speaker", speaker: "Skeleton Captain" }
    ]
  };
}

// --- Arrays ---
export const skeletons = skeletonPositions.map(pos => createSkeleton(pos));
export const armoredSkeletons = armoredSkeletonPositions.map(pos => createArmoredSkeleton(pos));

// --- Draw function ---
export function drawSkeleton(ctx, skel) {
  if (!skel.boss && !skel.active) return;
  if (skel.state === "dead" && skel.deadComplete) return;

  const screenX = skel.worldX - gameState.cameraX;

  ctx.save();

  if (skel.state === "dead" && skel.fadeOut !== undefined) {
    ctx.globalAlpha = 1 - skel.fadeOut;
  }

  if (skel.direction === "left") {
    ctx.translate(screenX + skel.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(
      skel.sprite,
      skel.frameX * 100, skel.frameY * 100, 100, 100,
      0, skel.y + spriteOffsetY,
      skel.width, skel.height
    );
  } else {
    ctx.drawImage(
      skel.sprite,
      skel.frameX * 100, skel.frameY * 100, 100, 100,
      screenX, skel.y + spriteOffsetY,
      skel.width, skel.height
    );
  }

  ctx.restore();
}

// --- Update function ---
export function updateSkeletons() {
    const attackDistance = 40;
    const allSkeletons = [...skeletons, ...armoredSkeletons];
  
    allSkeletons.forEach(skel => {
      // --- Animate idle/walk frames ---
      if (skel.state === "idle" || skel.state === "walk") {
        skel.frameTimer++;
        if (skel.frameTimer >= skel.frameInterval) {
          skel.frameTimer = 0;
          skel.frameX++;
          if (skel.frameX >= skel.maxFrames) skel.frameX = 0;
        }
      }
  
      // --- Skip dead + fully faded ---
      if (skel.state === "dead" && skel.deadComplete) return;
  
      // --- Boss dialogue / bubble handling ---
      if (skel.boss && !skel.dialogueFinished) {
        skel.showBubble = true; // always show bubble until dialogue done
        return; // skip AI movement/attack until dialogue finished
      }
  
      // --- Activate regular skeletons ---
      if (!skel.active && !skel.boss) {
        if (Math.abs(player.worldX - skel.worldX) < 300) {
          skel.active = true;
        } else {
          return; // skip if not close enough
        }
      }
  
      const distance = player.worldX - skel.worldX;
  
      // --- Death handling ---
      if (skel.state === "dead") {
        if (!skel.xpGiven) {
          gainXP(skel.boss ? 50 : 25);
          skel.xpGiven = true;
        }
        if (!skel.deadComplete) {
          skel.frameTimer++;
          if (skel.frameTimer >= skel.frameInterval) {
            skel.frameTimer = 0;
            if (skel.frameX < skel.maxFrames - 1) skel.frameX++;
            else {
              if (!skel.fadeOut) skel.fadeOut = 0;
              skel.fadeOut += 1 / 30;
              if (skel.fadeOut >= 1) skel.deadComplete = true;
            }
          }
        }
        return;
      }
  
      // --- Face player ---
      skel.direction = distance < 0 ? "left" : "right";
  
      // --- Attack or walk ---
      if (Math.abs(distance) <= attackDistance) {
        skel.state = "attack";
        skel.attacking = true;
        const actionSet = skel.boss ? armoredSkeletonActions : skeletonActions;
        skel.frameY = actionSet.attack.row;
        skel.maxFrames = actionSet.attack.frames;
  
        // Animate attack frames
        skel.frameTimer++;
        if (skel.frameTimer >= skel.frameInterval) {
          skel.frameTimer = 0;
          skel.frameX++;
  
          // Damage player on last frame
          if (!skel.attackHit && skel.frameX === skel.maxFrames - 1 && !player.isDead) {
            const skelLeft = skel.worldX;
            const skelRight = skel.worldX + skel.width;
            const playerLeft = player.worldX;
            const playerRight = player.worldX + player.width;
            if (skelRight > playerLeft && skelLeft < playerRight) {
              player.health -= skel.attackDamage;
              player.health = Math.max(0, player.health);
              skel.attackHit = true;
            }
          }
  
          // Reset attackHit once animation loops
          if (skel.frameX >= skel.maxFrames) {
            skel.frameX = 0;
            skel.attackHit = false;
          }
        }
  
      } else {
        // Walk toward player
        skel.state = "walk";
        skel.attacking = false;
        skel.attackHit = false;
  
        const actionSet = skel.boss ? armoredSkeletonActions : skeletonActions;
        skel.frameY = actionSet.walk.row;
        skel.maxFrames = actionSet.walk.frames;
  
        const moveDir = distance > 0 ? 1 : -1;
        skel.worldX += skel.speed * moveDir;
      }
  
      // --- Adjust animation speed ---
      if (skel.boss) skel.frameInterval = skel.state === "attack" ? 10 : 3;
      else skel.frameInterval = skel.state === "attack" ? 16 : 5;
    });
  }

