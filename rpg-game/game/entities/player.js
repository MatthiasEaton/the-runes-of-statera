import { knightSprite } from "../core/assets.js";
import { groundY, spriteOffsetY } from "../core/config.js";
import { gameState } from "../core/game.js";
import { handlePlayerMovement } from "../core/input.js";
import { canvas } from "../core/config.js";
import { gravity } from "../core/config.js";
import { keys } from "../core/input.js";
import { dialogueState, drawDialogueArea, updateDialogue } from "../ui/dialogue.js";
import { jumpStrength } from "../core/config.js";
import { runes } from "../entities/npc.js";
import { inventoryItems } from "../ui/inventory.js";

export const playerActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
  attack: { row: 2, frames: 7 },
  bigAttack: { row: 4, frames: 12},
  hurt: { row: 5, frames: 4 },
  death: { row: 6, frames: 4 }
};

export const player = {
  worldX: 100,
  x: 100,
  y: 0,
  width: 300,
  height: 300,
  vy: 0,
  speed: 4,
  sprite: knightSprite,
  frameTimer: 0,
  frameInterval: 10,
  frameX: 0,
  frameY: playerActions.idle.row,
  maxFrames: playerActions.idle.frames,
  state: "idle",
  onGround: false,
  maxHealth: 100,
  health: 100,
  attackDamage: 20,
  isAttacking: false,
  attackHit: false,
  isDead: false,
  deathFrameX: 0,
  deathMaxFrames: playerActions.death.frames,
  deathAnimationDone: false,
  canMove: true,
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  vx: 0,
  vy: 0,
  actions: playerActions,
};


export const playerHitbox = {
  worldX: player.worldX + 20,
  y: player.y + 20,
  width: 60,
  height: 80
};

// --- XP gain function ---
export function gainXP(amount) {
  player.xp += amount;
  console.log(`Gained ${amount} XP, total now: ${player.xp}/${player.xpToNextLevel}`);

  while (player.xp >= player.xpToNextLevel) {
    player.xp -= player.xpToNextLevel;
    player.level += 1;

    // --- LEVEL-UP BONUSES ---
    player.maxHealth += 10;
    player.attackDamage += 5;
    player.health = Math.min(player.health + 20, player.maxHealth);

    // Update XP threshold for next level
    player.xpToNextLevel = Math.floor(player.xpToNextLevel * 1.2);

    // --- Activate level-up screen ---
    gameState.levelUpActive = true;
    gameState.levelUpMessage = `Level Up! You are now level ${player.level}\nHP +10, Attack +5`;

    console.log(`Level up! Now level ${player.level}`);
  }

  // Keep XP from going negative
  if (player.xp < 0) player.xp = 0;
}


player.y = groundY - player.height - spriteOffsetY;

player.direction = "right";

export function givePlayerItems(items) {
  if (!items) return;
  items.forEach(item => {
    inventory.push(item);
    console.log(`Recieved: ${item.name}`);
  });
}

export function updatePlayer(gameState) {

  handlePlayerMovement();

   // Death check
    if (player.health <= 0 && !player.isDead) {
      player.isDead = true;
      player.state = "death";
      player.frameY = playerActions.death.row;
      player.maxFrames = playerActions.death.frames;
      player.frameX = 0; // start death animation from beginning
      player.deathAnimationDone = false;
    }

   // If in dialogue, block movement and attacks
    if (dialogueState.chattingWithNPC) {
      player.canMove = false;
      player.state = "idle";
      updateDialogue();
      drawDialogueArea();
    }
  
    // Jump logic (disabled if dead)
    if (!player.isDead && keys.Space && player.onGround && player.canMove) {
      player.vy = -jumpStrength;
      player.onGround = false;
    }

  // Apply gravity
    player.vy += gravity;
    player.y += player.vy;
  
    // Landing
    if (player.y + player.height + spriteOffsetY >= groundY) {
      player.y = groundY - player.height - spriteOffsetY;
      player.vy = 0;
      player.onGround = true;
    }

    // Update player state (only if alive and not attacking)
  if (!player.isDead && !player.isAttacking) {
    if (keys.ArrowLeft || keys.ArrowRight) player.state = "walk";
    else player.state = "idle";

    player.frameY = playerActions[player.state].row;
    player.maxFrames = playerActions[player.state].frames;
  }
  
    // Keep player inside canvas horizontally
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas. width) player.x = canvas.width - player.width;
  
    // Animate player
player.frameTimer++;
if (player.frameTimer >= player.frameInterval) {
  player.frameTimer = 0;

  // 🔥 1. Death animation (highest priority)
  if (player.isDead) {

    // Move forward until last frame
    if (player.frameX < player.maxFrames - 1) {
      player.frameX++;
    }

    // ✅ Trigger once when reaching last frame
    if (player.frameX === player.maxFrames - 1 && !player.deathAnimationDone) {
      console.log("Death animation DONE");
      player.deathAnimationDone = true;
    }

    return; // STOP here so nothing overrides death animation
  }

  // 🔥 2. Attack animation
  if (player.isAttacking) {
    player.frameX++;

    if (player.frameX >= player.maxFrames) {
      player.frameX = 0;
      player.isAttacking = false;

      player.state = (keys.ArrowLeft || keys.ArrowRight) ? "walk" : "idle";
      player.frameY = playerActions[player.state].row;
      player.maxFrames = playerActions[player.state].frames;
    }

    return;
  }

  // 🔥 3. Normal animation
  player.frameX = (player.frameX + 1) % player.maxFrames;
}

}

function showSystemMessage(text) {
  // If dialogue not active, start a new “system session”
  if (!dialogueState.chattingWithNPC) {
    dialogueState.chattingWithNPC = { name: "system" };
    dialogueState.dialogueQueue = [];
    dialogueState.currentLineIndex = 0;

    player.canMove = false;
    player.state = "idle";
  }

  dialogueState.dialogueQueue.push({
    text: text,
    type: "system",
    speaker: "System"
  });

  // Start typing immediately if this is the first message
  if (dialogueState.currentLineIndex === dialogueState.dialogueQueue.length - 1) {
    dialogueState.dialogueText = text;
    dialogueState.displayedText = "";
    dialogueState.textIndex = 0;
    dialogueState.typingFinished = false;
    dialogueState.enterPromptVisible = false;
  }
}



export function giveRune(rune) {
  inventoryItems.push({
    img: rune.sprite,  // your preloaded image
    name: rune.name,
    type: "rune",
    description: rune.description
  });

  console.log(`Added rune: ${rune.name}`, inventoryItems);
}



export function collectRunes() {
// rune names: Aequor, Umbra, Ignis, Lumen
  const now = performance.now();

  runes.forEach(rune => {
    if (!rune.collected) {
      // Only allow collection after 0.4 seconds
    if (!rune.canCollect) {
      if (now - rune.spawnTime > 1000) rune.canCollect = true;
      else return; // skip collision check
    }
      const playerLeft = player.worldX;
      const playerRight = player.worldX + player.width;
      const playerTop = player.y;
      const playerBottom = player.y + player.height;

      const runeLeft = rune.worldX;
      const runeRight = rune.worldX + rune.width;
      const runeTop = rune.y;
      const runeBottom = rune.y + rune.height;

      const colliding = playerRight > runeLeft && playerLeft < runeRight &&
                        playerBottom > runeTop && playerTop < runeBottom;

                        if (colliding && rune.canCollect) {
                          rune.collected = true;
                  
                          // Add rune to inventory
                          giveRune(rune);
                  
                          // Queue a system message in dialogue
                          showSystemMessage(`You collected the ${rune.name}!`);
                          showSystemMessage(`Rune added to inventory.`);

                          gameState.justCollectedRune = {
                            name: rune.name,
                            id: rune.id || rune.name
                          };
        
      }
    }
  });
}
