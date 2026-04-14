import { player } from "../entities/player.js";
import { ctx } from "../core/config.js";
import { groundY, spriteOffsetY } from "../core/config.js";
import { priestSprite, kingSprite, knightTemplarSprite, archerSprite, wizardSprite, greatswordSkeletonSprite, orcKingSprite } from "../core/assets.js";
import { gameState } from "../core/game.js";
import { dialogueState } from "../ui/dialogue.js";
import { lancerSprite } from "../core/assets.js";

export const priestActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
}

export const priestStates = {
  idle: "idle",
  walk: "walk",
}

export const priest = {
  name: "priest",
  worldX: 500, // near the player
  y: groundY - 300 - spriteOffsetY, // same ground alignment
  width: 300,
  height: 300,
  sprite: priestSprite,
  frameX: 0,
  frameY: priestActions.idle.row, // row of idle animation
  maxFrames: priestActions.idle.frames, // how many frames are in the idle animation
  frameTimer: 0,
  frameInterval: 10, // controls animation speed
  speed: 4,
  state: "idle",
  showBubble: true,
  direction: "left",
  dialogueFinished: false,
  dialogue: [
    { text: "Hello traveler!", type: "speaker", speaker: "Priest" },
    { text: "These woods are treacherous.", type: "speaker", speaker: "Priest" },
    { text: "You should take these with you so you can heal yourself when your health is low.", type: "speaker", speaker: "Priest" },
    { text: "Player recieved 3 healing potions!", type: "system", speaker: "System", special: "givePotions" },
    { text: "You can access these in your inventory bag in the top right corner of your screen.", type: "speaker", speaker: "Priest" },
    { text: "Click on the bag icon to open it and click on the potions to use them.", type: "speaker", speaker: "Priest" },
    { text: "May the power of Kamanuk guide you!", type: "speaker", speaker: "Priest" }
  ]
};

export function updatePriest() {
  // Always force idle during dialogue
  if (dialogueState.chattingWithNPC) {
    priest.state = "idle";
    priest.frameY = priestActions.idle.row;
    priest.maxFrames = priestActions.idle.frames;
  }

  // Animation should STILL run
  priest.frameTimer++;
  if (priest.frameTimer >= priest.frameInterval) {
    priest.frameTimer = 0;
    priest.frameX = (priest.frameX + 1) % priest.maxFrames;
  }
}




export function drawPriest() {
  if (priest.state === "gone") return;

  const frameWidth = 100;
  const frameHeight = 100;

  // screenX from world
  const baseScreenX = priest.worldX - gameState.cameraX;

  // === compute final screenX exactly as your drawing code will use ===
  const screenX = baseScreenX; // we'll use baseScreenX for drawing the sprite origin (see below)

  ctx.save();
  if (priest.direction === "left") {
    // flip around the left edge so sprite is anchored to worldX
    ctx.translate(screenX + priest.width, 0);
    ctx.scale(-1, 1);

    // draw the sprite
    ctx.drawImage(
      priest.sprite,
      priest.frameX * frameWidth,
      priest.frameY * frameHeight,
      frameWidth,
      frameHeight,
      0,
      priest.y + spriteOffsetY,
      priest.width,
      priest.height
    );
  } else {
    // right facing
    ctx.drawImage(
      priest.sprite,
      priest.frameX * frameWidth,
      priest.frameY * frameHeight,
      frameWidth,
      frameHeight,
      screenX,
      priest.y + spriteOffsetY,
      priest.width,
      priest.height
    );
  }
  ctx.restore();
}

export const archerActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
}

export const archerStates = { idle: "idle", walk: "walk" }

export const archer = {
  name: "archer",
  worldX: 600, // near the player
  y: groundY - 300 - spriteOffsetY, // same ground alignment
  width: 300,
  height: 300,
  sprite: archerSprite,
  frameX: 0,
  frameY: archerActions.idle.row, // row of idle animation
  maxFrames: archerActions.idle.frames, // how many frames are in the idle animation
  frameTimer: 0,
  frameInterval: 10, // controls animation speed
  speed: 4,
  state: "idle",
  waitTimer: 0,
  waitDuration: 120,
  showBubble: true,
  direction: "left",
  dialogueFinished: false,
  dialogue: [
    { text: "Greetings, great hero!", type: "speaker", speaker: "Archer" },
    { text: "I tried to collect the runes myself, but this part of the forest… it’s too dangerous. I had to turn back.", type: "speaker", speaker: "Archer" },
    { text: "Take my remaining potions, they'll help you push on where I couldn't.", type: "speaker", speaker: "Archer" },
    { text: "Player recieved 3 healing potions!", type: "system", speaker: "System", special: "givePotions" },
    { text: "Be careful out there... I hope you can make it farther than I did.", type: "speaker", speaker: "Archer" }
  ]
};

export function updateArcher() {
  // Always idle (even during dialogue)
  archer.state = "idle";
  archer.frameY = archerActions.idle.row;
  archer.maxFrames = archerActions.idle.frames;

  archer.frameTimer++;
  if (archer.frameTimer >= archer.frameInterval) {
    archer.frameTimer = 0;
    archer.frameX = (archer.frameX + 1) % archer.maxFrames;
  }
}

export function drawArcher() {
  if (archer.state === "gone") return;

  const frameWidth = 100;
  const frameHeight = 100;

  // screenX from world
  const baseScreenX = archer.worldX - gameState.cameraX;

  // === compute final screenX exactly as your drawing code will use ===
  const screenX = baseScreenX; // we'll use baseScreenX for drawing the sprite origin (see below)

  ctx.save();
  if (archer.direction === "left") {
    // flip around the left edge so sprite is anchored to worldX
    ctx.translate(screenX + archer.width, 0);
    ctx.scale(-1, 1);

    // draw the sprite
    ctx.drawImage(
      archer.sprite,
      archer.frameX * frameWidth,
      archer.frameY * frameHeight,
      frameWidth,
      frameHeight,
      0,
      archer.y + spriteOffsetY,
      archer.width,
      archer.height
    );
  } else {
    // right facing
    ctx.drawImage(
      archer.sprite,
      archer.frameX * frameWidth,
      archer.frameY * frameHeight,
      frameWidth,
      frameHeight,
      screenX,
      archer.y + spriteOffsetY,
      archer.width,
      archer.height
    );
  }
  ctx.restore();
}

export const lancerActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
}

export const lancerStates = { idle: "idle", walk: "walk" }

export const lancer = {
  name: "Lancer",
  worldX: 500, // near the player
  y: groundY - 300 - spriteOffsetY, // same ground alignment
  width: 300,
  height: 300,
  sprite: lancerSprite,
  frameX: 0,
  frameY: lancerActions.idle.row, // row of idle animation
  maxFrames: lancerActions.idle.frames, // how many frames are in the idle animation
  frameTimer: 0,
  frameInterval: 10, // controls animation speed
  speed: 4,
  state: "idle",
  waitTimer: 0,
  waitDuration: 120,
  showBubble: true,
  direction: "left",
  dialogueFinished: false,
  dialogue: [
    { text: "Ah, I'm glad to see you've made it this far, great hero!", type: "speaker", speaker: "Lancer" },
    { text: "King Razarac has sent me to ensure that you are completing your quest.", type: "speaker", speaker: "Lancer" },
    { text: "I see that your resolve is strong.", type: "speaker", speaker: "Lancer" },
    { text: "You will soon be approaching the layer of the Orc King. Be prepared.", type: "speaker", speaker: "Lancer" },
    { text: "Our king has requested that I bring you some additional potions.", type: "speaker", speaker: "Lancer" },
    { text: "Player recieved 3 healing potions!", type: "system", speaker: "System", special: "givePotions" },
    { text: "This part of the forest is protected by treacherous creatures. You will need to be prepared.", type: "speaker", speaker: "Lancer" },
    { text: "Best of luck to you, great hero!", type: "speaker", speaker: "Lancer" }
  ]
};

export function updateLancer() {
  // Always idle (including during dialogue)
  lancer.state = "idle";
  lancer.frameY = lancerActions.idle.row;
  lancer.maxFrames = lancerActions.idle.frames;

  lancer.frameTimer++;
  if (lancer.frameTimer >= lancer.frameInterval) {
    lancer.frameTimer = 0;
    lancer.frameX = (lancer.frameX + 1) % lancer.maxFrames;
  }
}

export function drawLancer() {
  if (lancer.state === "gone") return;

  const frameWidth = 100;
  const frameHeight = 100;

  // screenX from world
  const baseScreenX = lancer.worldX - gameState.cameraX;

  // === compute final screenX exactly as your drawing code will use ===
  const screenX = baseScreenX; // we'll use baseScreenX for drawing the sprite origin (see below)

  ctx.save();
  if (lancer.direction === "left") {
    // flip around the left edge so sprite is anchored to worldX
    ctx.translate(screenX + lancer.width, 0);
    ctx.scale(-1, 1);

    // draw the sprite
    ctx.drawImage(
      lancer.sprite,
      lancer.frameX * frameWidth,
      lancer.frameY * frameHeight,
      frameWidth,
      frameHeight,
      0,
      lancer.y + spriteOffsetY,
      lancer.width,
      lancer.height
    );
  } else {
    // right facing
    ctx.drawImage(
      lancer.sprite,
      lancer.frameX * frameWidth,
      lancer.frameY * frameHeight,
      frameWidth,
      frameHeight,
      screenX,
      lancer.y + spriteOffsetY,
      lancer.width,
      lancer.height
    );
  }
  ctx.restore();
}

export const kingActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
}

export const king = {
  name: "king",
  worldX: 350, // near the player
  y: groundY - 300 - spriteOffsetY, // same ground alignment
  width: 300,
  height: 300,
  sprite: kingSprite,
  frameX: 0,
  frameY: kingActions.idle.row, // row of idle animation
  maxFrames: kingActions.idle.frames, // how many frames are in the idle animation
  frameTimer: 0,
  frameInterval: 10, // controls animation speed
  speed: 2,
  state: "idle",
  showBubble: true,
  dialogueFinished: false,
  // 👇 NEW
  introDialogue: [
    { text: "Ah, you’ve arrived. I’ve been waiting for you.", type: "speaker", speaker: "King Razarac" },
    { text: "I have called upon you for a great mission.", type: "speaker", speaker: "King Razarac" },
    { text: "The Orc King, Pelindung, and his minions threaten our kingdom. They are our greatest enemy.", type: "speaker", speaker: "King Razarac" },
    { text: "I have heard that they are planning to use the Runes of Statera against us.", type: "speaker", speaker: "King Razarac" },
    { text: "If the forest dwellers use the runes, our kingdom will fall. You must find the Runes before they use them.", type: "speaker", speaker: "King Razarac" },
    { text: "Journey to the forest and find the Runes. Bring them back to me, and we shall protect our people.", type: "speaker", speaker: "King Razarac" },
    { text: "I trust you, hero. The fate of the realm rests with you.", type: "speaker", speaker: "King Razarac" }
  ],

  finalDialogue: [
    { text: "...You returned.", type: "speaker", speaker: "King Razarac" },
{ text: "And the forest still stands...", type: "speaker", speaker: "King Razarac" },
{ text: "Then... my forces have failed.", type: "speaker", speaker: "King Razarac" },
{ text: "So this is defeat.", type: "speaker", speaker: "King Razarac" },
{ text: "After everything... all I’ve commanded...", type: "speaker", speaker: "King Razarac" },
{ text: "It was not enough.", type: "speaker", speaker: "King Razarac" },
{ text: "...", type: "speaker", speaker: "King Razarac" },
{ text: "I believed strength alone could bring order.", type: "speaker", speaker: "King Razarac" },
{ text: "That the forest... needed to be subdued.", type: "speaker", speaker: "King Razarac" },
{ text: "But it endured.", type: "speaker", speaker: "King Razarac" },
{ text: "It resisted... because it was never meant to be conquered.", type: "speaker", speaker: "King Razarac" },
{ text: "...Was I wrong?", type: "speaker", speaker: "King Razarac" },
{ text: "No... I was.", type: "speaker", speaker: "King Razarac" },
{ text: "This path has only led to ruin.", type: "speaker", speaker: "King Razarac" },
{ text: "No more.", type: "speaker", speaker: "King Razarac" },
{ text: "I will end this war.", type: "speaker", speaker: "King Razarac" },
{ text: "And I will go to the Orc King myself.", type: "speaker", speaker: "King Razarac" },
{ text: "Not as a ruler seeking victory...", type: "speaker", speaker: "King Razarac" },
{ text: "But as a man seeking peace.", type: "speaker", speaker: "King Razarac" },
{ text: "...If I can still earn it.", type: "speaker", speaker: "King Razarac" },
{ text: "Perhaps true strength...", type: "speaker", speaker: "King Razarac" },
{ text: "Is knowing when to lay the sword down.", type: "speaker", speaker: "King Razarac" }
  ],

  returnWithRunesDialogue: [
    { text: "Ah… you have returned, and you have done well.", type: "speaker", speaker: "King Razarac" },
    { text: "With the runes now in my hands, nothing will stand in the way of my empire.", type: "speaker", speaker: "King Razarac" },
    { text: "Too long have the creatures of the forest resisted me… standing in the path of my expansion.", type: "speaker", speaker: "King Razarac" },
    { text: "But no longer.", type: "speaker", speaker: "King Razarac" },
    { text: "The forest is defenseless, and the balance that protected it has been broken.", type: "speaker", speaker: "King Razarac" },
    { text: "At last, my kingdom will expand without resistance.", type: "speaker", speaker: "King Razarac" },
    { text: "And you… you have served me well.", type: "speaker", speaker: "King Razarac" },
    { text: "For your loyalty and your success, you shall be rewarded.", type: "speaker", speaker: "King Razarac" },
    { text: "Stand with me, and together we will shape this world into something greater.", type: "speaker", speaker: "King Razarac" }
  ],
  dialogue: []
};

export const knightTemplarActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
  attack: { row: 4, frames: 7 },
  death: { row: 8, frames: 4 }
}

export const knightTemplar = [

{
  worldX: 220,
  y: groundY - 300 - spriteOffsetY,
  width: 300,
  height: 300,
  sprite: knightTemplarSprite,
  frameX: 0,
  frameY: knightTemplarActions.idle.row,
  maxFrames: knightTemplarActions.idle.frames,
  frameTimer: 0,
  frameInterval: 10,
  speed: 2,
  state: "idle"
},
{
  worldX: 500,
  y: groundY - 300 - spriteOffsetY,
  width: 300,
  height: 300,
  sprite: knightTemplarSprite,
  frameX: 0,
  frameY: knightTemplarActions.idle.row,
  maxFrames: knightTemplarActions.idle.frames,
  frameTimer: 0,
  frameInterval: 10,
  speed: 2,
  state: "idle"
},
];

export const wizardActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
}

export const wizard = {
  name: "wizard",
  worldX: 0,
  y: 0,
  width: 300,
  height: 300,

  state: "hidden", // hidden → fading → idle
  alpha: 0,        // for fade in

  frameX: 0,
  frameY: 0,
  frameTimer: 0,
  frameInterval: 10,
  maxFrames: 4,

  direction: "left",
  sprite: wizardSprite,
  showBubble: false,
  dialogueFinished: false,
  dialogue: [
    { text: "Stop this at once!", type: "speaker", speaker: "Forest Wizard" },
    { text: "I am Beobachter, one of the forest's guardians. You may call me Beo.", type: "speaker", speaker: "Beo" },
    { text: "I have been watching you since you entered the forest.", type: "speaker", speaker: "Beo" },
    { text: "I cannot let you continue without telling you the truth.", type: "speaker", speaker: "Beo" },
    { text: "King Razarac is not what he seems.", type: "speaker", speaker: "Beo" },
    { text: "You may think he wishes to collect the Runes to restore peace, but the truth is far darker.", type: "speaker", speaker: "Beo" },
    { text: "The king is maddened with greed and will stop at nothing to get what he wants.", type: "speaker", speaker: "Beo" },
    { text: "He desires the Runes of Statera for his own selfish gain.", type: "speaker", speaker: "Beo" },
    { text: "These runes are a powerful force created centuries ago by the spirits of the forest. ", type: "speaker", speaker: "Beo" },
    { text: "When combined, they protect nature from those who would destroy it.", type: "speaker", speaker: "Beo" },
    { text: "If the king gets his hands on the runes, he will destroy the forest and all who reside here.", type: "speaker", speaker: "Beo" },
    { text: "You have a choice, young hero.", type: "speaker", speaker: "Beo" },
    { text: "Will you continue on your path to help the king destroy it, or help us fight to preserve this sacred forest?", type: "speaker", speaker: "Beo" }
  ]
};

export function updateWizard() {
  if (wizard.state === "hidden") return;

  function facePlayer(wizard, player) {
    if (player.worldX < wizard.worldX) {
      wizard.direction = "left";
    } else {
      wizard.direction = "right";
    }
  }

  facePlayer(wizard, player);

  switch (wizard.state) {
    case "fading":
      // gradually fade in the wizard
      wizard.alpha += 0.01;
      if (wizard.alpha >= 1) {
        wizard.alpha = 1;
        wizard.state = "idle";

        // show dialogue bubble when fully visible
        wizard.showBubble = true;

        // unlock player when fully visible
        player.canMove = true;
      }
      break;

    case "idle":
      wizard.frameY = wizardActions.idle.row;
      wizard.maxFrames = wizardActions.idle.frames;
      break;
  }

  // animation frames
  wizard.frameTimer++;
  if (wizard.frameTimer >= wizard.frameInterval) {
    wizard.frameTimer = 0;
    wizard.frameX = (wizard.frameX + 1) % wizard.maxFrames;
  }
}

export function drawWizard() {
  if (wizard.state === "hidden") return;

  const frameWidth = 100;
  const frameHeight = 100;
  const screenX = wizard.worldX - gameState.cameraX;

  ctx.save();
  ctx.globalAlpha = wizard.alpha;

  if (wizard.direction === "left") {
    ctx.translate(screenX + wizard.width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(
      wizard.sprite,
      wizard.frameX * frameWidth,
      wizard.frameY * frameHeight,
      frameWidth,
      frameHeight,
      0,
      wizard.y + spriteOffsetY,
      wizard.width,
      wizard.height
    );
  } else {
    ctx.drawImage(
      wizard.sprite,
      wizard.frameX * frameWidth,
      wizard.frameY * frameHeight,
      frameWidth,
      frameHeight,
      screenX,
      wizard.y + spriteOffsetY,
      wizard.width,
      wizard.height
    );
  }

  ctx.restore();
}

export const castleNPCActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
};

export const castleNPCStates = { idle: "idle", walk: "walk" };

export const castleNPC = {
  name: "castleGuide",
  worldX: 400, // near player start
  y: groundY - 300 - spriteOffsetY,
  width: 300,
  height: 300,
  sprite: greatswordSkeletonSprite,
  frameX: 0,
  frameY: castleNPCActions.idle.row,
  maxFrames: castleNPCActions.idle.frames,
  frameTimer: 0,
  frameInterval: 10,
  speed: 4,
  state: "idle",
  waitTimer: 0,
  waitDuration: 120,
  showBubble: true,
  direction: "left",
  dialogueFinished: false,
  dialogue: [
    { text: "Ah, You've made it this far!", type: "speaker", speaker: "Skeleton Knight" },
    { text: "Our army has taken over most of the castle already.", type: "speaker", speaker: "Skeleton Knight" },
    { text: "Continue through the castle until you find the King.", type: "speaker", speaker: "Skeleton Knight" },
    { text: "Take these potions to aid your survival.", type: "speaker", speaker: "Skeleton Knight" },
    { text: "Player received 3 healing potions!", type: "system", speaker: "System", special: "givePotions" },
    { text: "Victory is nearly at hand!", type: "speaker", speaker: "Skeleton Knight" },
  ],
};

// --- UPDATE ---
export function updateCastleNPC() {
  // Always idle (even during dialogue)
  castleNPC.state = "idle";
  castleNPC.frameY = castleNPCActions.idle.row;
  castleNPC.maxFrames = castleNPCActions.idle.frames;

  castleNPC.frameTimer++;
  if (castleNPC.frameTimer >= castleNPC.frameInterval) {
    castleNPC.frameTimer = 0;
    castleNPC.frameX = (castleNPC.frameX + 1) % castleNPC.maxFrames;
  }
}

// --- DRAW ---
export function drawCastleNPC() {
  if (castleNPC.state === "gone") return;

  const frameWidth = 100;
  const frameHeight = 100;

  const screenX = castleNPC.worldX - gameState.cameraX;

  ctx.save();
  if (castleNPC.direction === "left") {
    ctx.translate(screenX + castleNPC.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(
      castleNPC.sprite,
      castleNPC.frameX * frameWidth,
      castleNPC.frameY * frameHeight,
      frameWidth,
      frameHeight,
      0,
      castleNPC.y + spriteOffsetY,
      castleNPC.width,
      castleNPC.height
    );
  } else {
    ctx.drawImage(
      castleNPC.sprite,
      castleNPC.frameX * frameWidth,
      castleNPC.frameY * frameHeight,
      frameWidth,
      frameHeight,
      screenX,
      castleNPC.y + spriteOffsetY,
      castleNPC.width,
      castleNPC.height
    );
  }
  ctx.restore();
}

export const orcKingActions = {
  idle: { row: 0, frames: 6 },
  walk: { row: 1, frames: 8 },
}

export const orcKing = {
  name: "orcKing",
  worldX: 320, // near the player
  y: groundY - 300 - spriteOffsetY, // same ground alignment
  width: 300,
  height: 300,
  sprite: orcKingSprite,
  frameX: 0,
  frameY: orcKingActions.idle.row,
  maxFrames: orcKingActions.idle.frames,
  frameTimer: 0,
  frameInterval: 10,
  speed: 2,
  state: "idle",
  direction: "left",
  showBubble: true,
  dialogueFinished: false,
  dialogue: [
    { text: "So... you stand before me at last.", type: "speaker", speaker: "King Pelindung" },
    { text: "I can feel it... my army has fallen.", type: "speaker", speaker: "King Pelindung" },
    { text: "The cries of war have gone silent.", type: "speaker", speaker: "King Pelindung" },
    { text: "There is no strength left to resist you.", type: "speaker", speaker: "King Pelindung" },
    { text: "…I have fought long enough.", type: "speaker", speaker: "King Pelindung" },
    { text: "Take it. The final rune.", type: "speaker", speaker: "King Pelindung" },
    { text: "Player recieved the Rune of Lumen!", type: "system", speaker: "System", special: "giveRune" },
    { text: "You now carry what remains of this place’s power.", type: "speaker", speaker: "King Pelindung" },
    { text: "Do you feel it?", type: "speaker", speaker: "King Pelindung" },
    { text: "The forest… it is fading.", type: "speaker", speaker: "King Pelindung" },
    { text: "The magic that once lived within its roots is dying.", type: "speaker", speaker: "King Pelindung" },
    { text: "Not just by our blades… but by time itself.", type: "speaker", speaker: "King Pelindung" },
    { text: "All things return to silence, in the end.", type: "speaker", speaker: "King Pelindung" },
    { text: "I wonder… can you live with what remains?", type: "speaker", speaker: "King Pelindung" },
  ]
};

export function updateOrcKing() {
  // Always idle (even during dialogue)
  orcKing.state = "idle";
  orcKing.frameY = orcKingActions.idle.row;
  orcKing.maxFrames = orcKingActions.idle.frames;

  orcKing.frameTimer++;
  if (orcKing.frameTimer >= orcKing.frameInterval) {
    orcKing.frameTimer = 0;
    orcKing.frameX = (orcKing.frameX + 1) % orcKing.maxFrames;
  }
}

export function drawOrcKing() {
  if (orcKing.state === "gone") return;

  const frameWidth = 100;
  const frameHeight = 100;

  // screenX from world
  const baseScreenX = orcKing.worldX - gameState.cameraX;

  // === compute final screenX exactly as your drawing code will use ===
  const screenX = baseScreenX;

  ctx.save();
  if (orcKing.direction === "left") {
    // flip around the left edge so sprite is anchored to worldX
    ctx.translate(screenX + orcKing.width, 0);
    ctx.scale(-1, 1);

    // draw the sprite
    ctx.drawImage(
      orcKing.sprite,
      orcKing.frameX * frameWidth,
      orcKing.frameY * frameHeight,
      frameWidth,
      frameHeight,
      0,
      orcKing.y + spriteOffsetY,
      orcKing.width,
      orcKing.height
    );
  } else {
    // right facing
    ctx.drawImage(
      orcKing.sprite,
      orcKing.frameX * frameWidth,
      orcKing.frameY * frameHeight,
      frameWidth,
      frameHeight,
      screenX,
      orcKing.y + spriteOffsetY,
      orcKing.width,
      orcKing.height
    );
  }
  ctx.restore();
}

export function updateNPCs() {
  [king, ...knightTemplar].forEach(npc => {
    switch (npc.state) {
      case "talking":
        // Freeze on a single idle frame
        npc.frameY = npc.actions?.idle?.row ?? 0; // use idle row if defined
        npc.maxFrames = 1;
        npc.frameX = 0;
        break;

      default:
        // Normal idle/walk animation
        npc.frameTimer++;
        if (npc.frameTimer >= npc.frameInterval) {
          npc.frameTimer = 0;
          npc.frameX = (npc.frameX + 1) % npc.maxFrames;
        }

        // --- Face player ---
        const dx = player.worldX - npc.worldX;
        npc.direction = dx < 0 ? "left" : "right";
        break;
    }
  });
}

export const runes = [];