import { groundY, spriteOffsetY } from "../core/config.js";
import { wereWolfSprite, werebearSprite } from "../core/assets.js";
import { player } from "../entities/player.js";
import { gameState } from "../core/game.js";
import { gainXP } from "../entities/player.js";


export const wereWolfActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
  attack: { row: 2, frames: 9 },
  hurt: { row: 4, frames: 4 },
  death: { row: 5, frames: 4 }
};

export const werebearActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
  attack: { row: 2, frames: 9 },
  hurt: { row: 5, frames: 4 },
  death: { row: 6, frames: 4 }
};

export const wereWolfPositions = [2000, 2300, 3400, 3600, 4400, 4600, 5400, 6200, 6500, 6800, 6900, 7300, 7600, 7900, 8600, 8700, 8900, 9400, 10000, 10300, 10500, 10600, 10700];

export function createWereWolf(worldX) {
  return {
    type: "wereWolf",
    worldX: worldX,
    startX: worldX, // ✅ important
    y: groundY - 300 - spriteOffsetY,
    width: 300,
    height: 300,
    speed: 1.5,
    frameX: 0,
    frameY: wereWolfActions.idle.row,
    maxFrames: wereWolfActions.idle.frames,
    active: false,
    attacking: false,
    sprite: wereWolfSprite,
    frameTimer: 0,
    frameInterval: 4,
    maxHealth: 100,
    health: 100,
    attackDamage: 20,
    fadeOut: 0,
    deadComplete: false,
    isAttacking: false,
    attackHit: false,
    state: "idle",
    xpGiven: false,
    actions: wereWolfActions,
  };
}

export function createWerebear(worldX) {
  return {
    type: "werebear",
    name: "werebear",
    worldX: worldX,
    startX: worldX, // ✅ important
    y: groundY - 300 - spriteOffsetY,
    width: 300,
    height: 300,
    speed: 1.5, // maybe slower, feels heavier
    frameX: 0,
    frameY: werebearActions.idle.row,
    maxFrames: werebearActions.idle.frames,
    active: false,
    attacking: false,
    sprite: werebearSprite,
    frameTimer: 0,
    frameInterval: 4,
    maxHealth: 360,
    health: 360,
    attackDamage: 30,
    fadeOut: 0,
    deadComplete: false,
    isAttacking: false,
    attackHit: false,
    state: "idle",
    xpGiven: false,
    direction: "left",
    boss: true, // handy flag for rune drop / dialogue
    runeDropped: false,
    actions: werebearActions,
    showBubble: true,
  dialogueFinished: false,
  dialogue: [
    { text: "…You carry the weight of what you’ve learned.", type: "speaker", speaker: "Werebear Captain" },
    { text: "Then you understand now… the king does not seek peace.", type: "speaker", speaker: "Werebear Captain" },
    { text: "He seeks control. And the runes are his key.", type: "speaker", speaker: "Werebear Captain" },
    { text: "This forest is not just land… it is life.", type: "speaker", speaker: "Werebear Captain" },
    { text: "We have bled to protect it from those who would take it.", type: "speaker", speaker: "Werebear Captain" },
    { text: "If you truly stand against the forest… you will be destroyed.", type: "speaker", speaker: "Werebear Captain" },
    { text: "Defeat me. And take the rune from my hands.", type: "speaker", speaker: "Werebear Captain" }
  ]
  };
}

export const werebearPositions = [14500];

export const werebears = werebearPositions.map(pos => createWerebear(pos));

export function drawWereWolf(ctx, wereWolf) {
  // Skip inactive regular wereWolfs
  if (!wereWolf.boss && !wereWolf.active) return;

  // Skip fully faded dead wereWolfs
  if (wereWolf.state === "dead" && wereWolf.deadComplete) return;

  const wereWolfScreenX = wereWolf.worldX - gameState.cameraX;

  ctx.save();

  // Handle fade-out transparency
  if (wereWolf.state === "dead" && wereWolf.fadeOut !== undefined) {
    ctx.globalAlpha = 1 - wereWolf.fadeOut;
  }

  if (wereWolf.direction === "left") {
    ctx.translate(wereWolfScreenX + wereWolf.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(
      wereWolf.sprite,
      wereWolf.frameX * 100, wereWolf.frameY * 100, 100, 100,
      0, wereWolf.y + spriteOffsetY,
      wereWolf.width, wereWolf.height
    );
  } else {
    ctx.drawImage(
      wereWolf.sprite,
      wereWolf.frameX * 100, wereWolf.frameY * 100, 100, 100,
      wereWolfScreenX, wereWolf.y + spriteOffsetY,
      wereWolf.width, wereWolf.height
    );
  }

  ctx.restore();
}



// Generate the orcs array dynamically
export const wereWolfs = wereWolfPositions.map(pos => createWereWolf(pos));

wereWolfs.forEach(wereWolf => {
  const wereWolfHitbox = {
    worldX: wereWolf.worldX + 20,
    y: wereWolf.y + 20,
    width: wereWolf.width - 40,
    height: wereWolf.height - 40
  };
});

wereWolfs.forEach(wereWolf => {
  wereWolf.y = groundY - wereWolf.height - spriteOffsetY;
});


export function updateWereWolfs() {
  const attackDistance = 40;

  const allWereWolfs = [...wereWolfs, ...werebears]; // include both types


  allWereWolfs.forEach(wereWolf => {

      // Animate idle/walk if not attacking or dead
if (wereWolf.state === "idle" || wereWolf.state === "walk") {
  wereWolf.frameTimer++;
  if (wereWolf.frameTimer >= wereWolf.frameInterval) {
    wereWolf.frameTimer = 0;
    wereWolf.frameX++;
    if (wereWolf.frameX >= wereWolf.maxFrames) {
      wereWolf.frameX = 0;
    }
  }
}
    if (!wereWolf.active) {
      if (!wereWolf.boss && Math.abs(player.worldX - wereWolf.worldX) < 300) {
        // regular orcs auto-activate
        wereWolf.active = true;
      } else if (wereWolf.boss) {
        // armored orc only becomes active after dialogue finishes
        if (wereWolf.dialogueFinished) {
          wereWolf.active = true;
        } else {
          return; // skip until dialogue is done
        }
      } else {
        return;
      }
    }

    // Skip fully dead
    if (wereWolf.state === "dead" && wereWolf.deadComplete) return;

    const distance = player.worldX - wereWolf.worldX;

    // Handle death sequence
    if (wereWolf.state === "dead") {
      if (!wereWolf.xpGiven) {
        gainXP(wereWolf.boss ? 50 : 20); // armored orc gives more XP
        wereWolf.xpGiven = true;
      }

      if (!wereWolf.deadComplete) {
        wereWolf.frameTimer++;
        if (wereWolf.frameTimer >= wereWolf.frameInterval) {
          wereWolf.frameTimer = 0;
          if (wereWolf.frameX < wereWolf.maxFrames - 1) {
            wereWolf.frameX++;
          } else {
            if (wereWolf.fadeOut === undefined) wereWolf.fadeOut = 0;
            wereWolf.fadeOut += 1 / 30; // ~1 second fade
            if (wereWolf.fadeOut >= 1) {
              wereWolf.fadeOut = 1;
              wereWolf.deadComplete = true;
            }
          }
        }
      }
      return;
    }

    // Face player
    wereWolf.direction = distance < 0 ? "left" : "right";

    // Decide state & apply damage
    if (Math.abs(distance) <= attackDistance) {
      wereWolf.state = "attack";
      wereWolf.attacking = true;
      if (wereWolf.boss) {
        wereWolf.frameY = werebearActions.attack.row;
        wereWolf.maxFrames = werebearActions.attack.frames;
      } else {
        wereWolf.frameY = wereWolfActions.attack.row;
        wereWolf.maxFrames = wereWolfActions.attack.frames;
      }

      // --- Animate attack frames ---
  wereWolf.frameTimer++;
  if (wereWolf.frameTimer >= wereWolf.frameInterval) {
    wereWolf.frameTimer = 0;
    wereWolf.frameX++;

    // Apply damage at the **last frame of attack animation**

if (!wereWolf.attackHit && wereWolf.frameX === wereWolf.maxFrames - 1 && !player.isDead) {
  // check collision properly with player's bounding box
  const playerLeft = player.worldX;
  const playerRight = player.worldX + player.width;

  const wereWolfLeft = wereWolf.worldX;
  const wereWolfRight = wereWolf.worldX + wereWolf.width;

  const colliding = wereWolfRight > playerLeft && wereWolfLeft < playerRight;

  if (colliding) {
    player.health -= wereWolf.attackDamage;
    player.health = Math.max(0, player.health);
    console.log(`Player hit! Health now: ${player.health}`);
    wereWolf.attackHit = true; // prevent multiple hits in the same animation
  }
}


    // Reset attackHit once animation loops
    if (wereWolf.frameX >= wereWolf.maxFrames) {
      wereWolf.frameX = 0;
      wereWolf.attackHit = false; // ready for next attack
    }
  }

    } else {
      wereWolf.state = "walk";
      wereWolf.attacking = false;
      if (wereWolf.boss) {
        wereWolf.frameY = werebearActions.walk.row;
        wereWolf.maxFrames = werebearActions.walk.frames;
      } else {
        wereWolf.frameY = wereWolfActions.walk.row;
        wereWolf.maxFrames = wereWolfActions.walk.frames;
      }
      wereWolf.attackHit = false;

      // Move toward player
      const moveDirection = distance > 0 ? 1 : -1;
      wereWolf.worldX += wereWolf.speed * moveDirection;
    }

    // Adjust animation speed for attack vs walk
    if (wereWolf.boss) {
      wereWolf.frameInterval = (wereWolf.state === "attack") ? 10 : 3; // faster walk & attack animations
      wereWolf.walkSpeed = 2.5; // increase world movement
  } else {
      wereWolf.frameInterval = (wereWolf.state === "attack") ? 16 : 5;
      wereWolf.walkSpeed = 1; // normal orc speed
  }
  
  });
}
