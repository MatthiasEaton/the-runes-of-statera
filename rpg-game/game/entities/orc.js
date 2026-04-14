import { groundY, spriteOffsetY } from "../core/config.js";
import { orcSprite, armoredOrcSprite } from "../core/assets.js";
import { player } from "../entities/player.js";
import { gameState } from "../core/game.js";
import { gainXP } from "../entities/player.js";


export const orcActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
  attack: { row: 2, frames: 7 },
  hurt: { row: 4, frames: 4 },
  death: { row: 5, frames: 4 }
};

export const armoredOrcActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
  attack: { row: 2, frames: 6 },
  hurt: { row: 4, frames: 4 },
  death: { row: 7, frames: 4 }
};

export const orcPositions = [2000, 3400, 4400, 5400, 6200, 7000, 7900, 8600, 9400, 10000, 10300, 10500, 10600, 10700];

export function createOrc(worldX) {
  return {
    type: "orc",
    worldX: worldX,
    startX: worldX,
    y: groundY - 300 - spriteOffsetY,
    width: 300,
    height: 300,
    speed: 1.5,
    frameX: 0,
    frameY: orcActions.idle.row,
    maxFrames: orcActions.idle.frames,
    active: false,
    attacking: false,
    sprite: orcSprite,
    frameTimer: 0,
    frameInterval: 4,
    maxHealth: 50,
    health: 50,
    attackDamage: 10,
    fadeOut: 0,
    deadComplete: false,
    isAttacking: false,
    attackHit: false,
    state: "idle",
    xpGiven: false,
    actions: orcActions,
  };
}

export function createArmoredOrc(worldX) {
  return {
    type: "armoredOrc",
    name: "armoredOrc",
    worldX: worldX,
    startX: worldX, 
    y: groundY - 300 - spriteOffsetY,
    width: 300,
    height: 300,
    speed: 1.2, 
    frameX: 0,
    frameY: armoredOrcActions.idle.row,
    maxFrames: armoredOrcActions.idle.frames,
    active: false,
    attacking: false,
    sprite: armoredOrcSprite, 
    frameTimer: 0,
    frameInterval: 4,
    maxHealth: 200, 
    health: 200,
    attackDamage: 25, 
    fadeOut: 0,
    deadComplete: false,
    isAttacking: false,
    attackHit: false,
    state: "idle",
    xpGiven: false,
    direction: "left",
    boss: true, 
    runeDropped: false,
    showBubble: true,
  dialogueFinished: false,
  actions: armoredOrcActions,
  dialogue: [  
    { text: "So... You've come this far.", type: "speaker", speaker: "Orc Captain" },
    { text: "The king seeks the runes, but not for your kingdom's safety.", type: "speaker", speaker: "Orc Captain" },
    { text: "He will take what he wants, no matter the cost.", type: "speaker", speaker: "Orc Captain" },
    { text: "This forest… it is sacred, and I will not let him destroy it.", type: "speaker", speaker: "Orc Captain" },
    { text: "If you wish to leave with the runes, you’ll have to face me first.", type: "speaker", speaker: "Orc Captain" }
  ]
  };
}

export const armoredOrcPositions = [12500];

export const armoredOrcs = armoredOrcPositions.map(pos => createArmoredOrc(pos));

export function drawOrc(ctx, orc) {
  // Skip inactive regular orcs
  if (!orc.boss && !orc.active) return;

  // Skip fully faded dead orcs
  if (orc.state === "dead" && orc.deadComplete) return;

  const orcScreenX = orc.worldX - gameState.cameraX;

  ctx.save();

  // Handle fade-out transparency
  if (orc.state === "dead" && orc.fadeOut !== undefined) {
    ctx.globalAlpha = 1 - orc.fadeOut;
  }

  if (orc.direction === "left") {
    ctx.translate(orcScreenX + orc.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(
      orc.sprite,
      orc.frameX * 100, orc.frameY * 100, 100, 100,
      0, orc.y + spriteOffsetY,
      orc.width, orc.height
    );
  } else {
    ctx.drawImage(
      orc.sprite,
      orc.frameX * 100, orc.frameY * 100, 100, 100,
      orcScreenX, orc.y + spriteOffsetY,
      orc.width, orc.height
    );
  }

  ctx.restore();
}



// Generate the orcs array dynamically
export const orcs = orcPositions.map(pos => createOrc(pos));

orcs.forEach(orc => {
  const orcHitbox = {
    worldX: orc.worldX + 20,
    y: orc.y + 20,
    width: orc.width - 40,
    height: orc.height - 40
  };
});

orcs.forEach(orc => {
  orc.y = groundY - orc.height - spriteOffsetY;
});


export function updateOrcs() {
  const attackDistance = 40;

  const allOrcs = [...orcs, ...armoredOrcs]; // include both types


  allOrcs.forEach(orc => {

      // Animate idle/walk if not attacking or dead
if (orc.state === "idle" || orc.state === "walk") {
  orc.frameTimer++;
  if (orc.frameTimer >= orc.frameInterval) {
    orc.frameTimer = 0;
    orc.frameX++;
    if (orc.frameX >= orc.maxFrames) {
      orc.frameX = 0;
    }
  }
}
    if (!orc.active) {
      if (!orc.boss && Math.abs(player.worldX - orc.worldX) < 300) {
        // regular orcs auto-activate
        orc.active = true;
      } else if (orc.boss) {
        // armored orc only becomes active after dialogue finishes
        if (orc.dialogueFinished) {
          orc.active = true;
        } else {
          return; // skip until dialogue is done
        }
      } else {
        return;
      }
    }

    // Skip fully dead orcs
    if (orc.state === "dead" && orc.deadComplete) return;

    const distance = player.worldX - orc.worldX;

    // Handle death sequence
    if (orc.state === "dead") {
      if (!orc.xpGiven) {
        gainXP(orc.boss ? 50 : 20); // armored orc gives more XP
        orc.xpGiven = true;
      }

      if (!orc.deadComplete) {
        orc.frameTimer++;
        if (orc.frameTimer >= orc.frameInterval) {
          orc.frameTimer = 0;
          if (orc.frameX < orc.maxFrames - 1) {
            orc.frameX++;
          } else {
            if (orc.fadeOut === undefined) orc.fadeOut = 0;
            orc.fadeOut += 1 / 30; // ~1 second fade
            if (orc.fadeOut >= 1) {
              orc.fadeOut = 1;
              orc.deadComplete = true;
            }
          }
        }
      }
      return;
    }

    // Face player
    orc.direction = distance < 0 ? "left" : "right";

    // Decide state & apply damage
    if (Math.abs(distance) <= attackDistance) {
      orc.state = "attack";
      orc.attacking = true;
      if (orc.boss) {
        orc.frameY = armoredOrcActions.attack.row;
        orc.maxFrames = armoredOrcActions.attack.frames;
      } else {
        orc.frameY = orcActions.attack.row;
        orc.maxFrames = orcActions.attack.frames;
      }

      // --- Animate attack frames ---
  orc.frameTimer++;
  if (orc.frameTimer >= orc.frameInterval) {
    orc.frameTimer = 0;
    orc.frameX++;

    // Apply damage at the **last frame of attack animation**

if (!orc.attackHit && orc.frameX === orc.maxFrames - 1 && !player.isDead) {
  // check collision properly with player's bounding box
  const playerLeft = player.worldX;
  const playerRight = player.worldX + player.width;

  const orcLeft = orc.worldX;
  const orcRight = orc.worldX + orc.width;

  const colliding = orcRight > playerLeft && orcLeft < playerRight;

  if (colliding) {
    player.health -= orc.attackDamage;
    player.health = Math.max(0, player.health);
    console.log(`Player hit! Health now: ${player.health}`);
    orc.attackHit = true; // prevent multiple hits in the same animation
  }
}


    // Reset attackHit once animation loops
    if (orc.frameX >= orc.maxFrames) {
      orc.frameX = 0;
      orc.attackHit = false; // ready for next attack
    }
  }

    } else {
      orc.state = "walk";
      orc.attacking = false;
      if (orc.boss) {
        orc.frameY = armoredOrcActions.walk.row;
        orc.maxFrames = armoredOrcActions.walk.frames;
      } else {
        orc.frameY = orcActions.walk.row;
        orc.maxFrames = orcActions.walk.frames;
      }
      orc.attackHit = false;

      // Move toward player
      const moveDirection = distance > 0 ? 1 : -1;
      orc.worldX += orc.speed * moveDirection;
    }

    // Adjust animation speed for attack vs walk
    if (orc.boss) {
      orc.frameInterval = (orc.state === "attack") ? 10 : 3; // faster walk & attack animations
      orc.walkSpeed = 2.5; // increase world movement
  } else {
      orc.frameInterval = (orc.state === "attack") ? 16 : 5;
      orc.walkSpeed = 1; // normal orc speed
  }
  
  });
}
