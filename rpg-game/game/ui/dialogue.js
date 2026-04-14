import { player } from "../entities/player.js";
import { canvas, ctx } from "../core/config.js";
import { priest, king, archer, orcKing } from "../entities/npc.js";
import { roundRect } from "../core/utils.js";
import { gameState } from "../core/game.js";
import { speechBubble } from "../core/assets.js";
import { spriteOffsetY } from "../core/config.js";
import { givePotions, giveRune } from "./inventory.js";
import { armoredOrcs } from "../entities/orc.js";
import { armoredSkeletons } from "../entities/skeleton.js";
import { wizard, castleNPC, lancer } from "../entities/npc.js";
import { drawChoiceMenu } from "./hud.js";
import { werebears } from "../entities/forest3Enemies.js";

export const dialogueState = {
  dialogueQueue: [],
  currentLineIndex: 0,
  chattingWithNPC: null,

  dialogueText: "",       // Full line currently being typed
  displayedText: "",      // Text currently shown (typewriter effect)
  textIndex: 0,           // Current letter index
  textSpeed: 20,           // Frames per letter
  lastTextUpdate: 0,         // Frame counter
  typingFinished: false,  // Flag when line is fully typed
  dialogueFinished: false,
  npcReadyToWalk: false,

  enterPromptCounter: 0,
  enterPromptFlashRate: 500,
  lastPromptToggle: 0,
  choiceActive: false,
  choices: [],
  selectedChoice: 0,
}


const talkRadius = 80;              // Distance to trigger dialogue

// Start a dialogue sequence
export function startDialogue(npc) {
  if (!npc.dialogue || npc.dialogue.length === 0) return;

  dialogueState.dialogueQueue = npc.dialogue;
  dialogueState.currentLineIndex = 0;
  dialogueState.chattingWithNPC = npc;

  dialogueState.dialogueText = npc.dialogue[0].text;
  dialogueState.displayedText = "";
  dialogueState.textIndex = 0;
  dialogueState.textCounter = 0;
  dialogueState.typingFinished = false;

  player.canMove = false;

  // Hide bubble while talking
  if (npc.showBubble !== undefined) npc.showBubble = false;
}


// Advance to next line or finish dialogue
export function advanceDialogue() {
  if (gameState.levelUpActive) return;
  // 1️⃣ Finish line instantly if typing not done
  if (!dialogueState.typingFinished) {
    dialogueState.displayedText = dialogueState.dialogueText;
    dialogueState.textIndex = dialogueState.dialogueText.length;
    dialogueState.typingFinished = true;
    dialogueState.enterPromptCounter = 0;
    dialogueState.enterPromptVisible = true;
    return; // wait for next Enter
  }

  // 2️⃣ Advance to next line
  dialogueState.currentLineIndex++;

  if (dialogueState.currentLineIndex < dialogueState.dialogueQueue.length) {
    const currentLine = dialogueState.dialogueQueue[dialogueState.currentLineIndex];

    dialogueState.dialogueText = currentLine.text;
    dialogueState.displayedText = "";
    dialogueState.textIndex = 0;
    dialogueState.textCounter = -1;
    dialogueState.typingFinished = false;

    // trigger special actions
if (currentLine.special) {
  switch (currentLine.special) {
    case "givePotions":
      givePotions(3);
      break;
    case "giveRune":
      giveRune();
      break;
  }
}

    dialogueState.enterPromptCounter = 0;
    dialogueState.enterPromptVisible = true;

  } else {
    // 3️⃣ Last line pressed Enter → trigger NPC post-dialogue behavior
    if (dialogueState.chattingWithNPC) {
      const finishedNPC = dialogueState.chattingWithNPC;

      if (finishedNPC.showBubble !== undefined) finishedNPC.showBubble = false;
      finishedNPC.dialogueFinished = true;

      if (finishedNPC.name === "king" && !gameState.fadeActive) {
        finishedNPC.state = "idle";
        gameState.fadeActive = true;
        gameState.fadeDirection = 1;
      
        if (gameState.storyProgress === "postCastleBoss") {
          // 🏁 FINAL ENDING
          gameState.nextScene = "credits";
          gameState.fadeTextScene = "ending";
        } else if (gameState.storyProgress === "postRunesCollected") {
          // alternate ending
          gameState.nextScene = "credits";
          gameState.fadeTextScene = "ending2";
        } else {
          // 🎮 NORMAL GAME PROGRESSION
          gameState.nextScene = "forest";
          gameState.fadeTextScene = "throneRoom";
        }
      }

      if (finishedNPC.name === "orcKing" && !gameState.fadeActive) {
        finishedNPC.state = "idle";
      
        // Advance story
        gameState.storyProgress = "postRunesCollected";
      
        // Trigger fade
        gameState.fadeActive = true;
        gameState.fadeDirection = 1;
      
        // Send to your new scene
        gameState.nextScene = "throneRoom";
        gameState.fadeTextScene = "returningWithRune";
        gameState.justCollectedRune = null;
      }

      if (finishedNPC.name === "priest") {
        // Freeze exact position before dialogue
        if (!finishedNPC._freeze) finishedNPC._freeze = { worldX: finishedNPC.worldX };

        // restore position and start walking
        finishedNPC.worldX = finishedNPC._freeze.worldX;
        finishedNPC.state = "walk";
        finishedNPC.direction = "left";
        finishedNPC.frameTimer = 0;
        finishedNPC.frameX = 0;

        delete finishedNPC._freeze;
      }
      if (finishedNPC.name === "armoredOrc") {
        finishedNPC.active = true;
      }

      if (finishedNPC.name === "armoredSkeleton") {
        finishedNPC.active = true;
      }

      if (finishedNPC.name === "lancer") {
        finishedNPC.active = true;
      }

      if (finishedNPC.name === "archer") {
        // Freeze Archer’s exact position before dialogue
        if (!finishedNPC._freeze) finishedNPC._freeze = { worldX: finishedNPC.worldX };
      
        // Archer doesn’t walk away — just stays idle
        finishedNPC.worldX = finishedNPC._freeze.worldX;
        finishedNPC.state = "idle";
        finishedNPC.direction = "left";
        finishedNPC.frameTimer = 0;
        finishedNPC.frameX = 0;
      
        delete finishedNPC._freeze;
      }

      if (finishedNPC.name === "castleGuide") {
        finishedNPC.state = "idle";
        finishedNPC.direction = "left";
        finishedNPC.frameTimer = 0;
        finishedNPC.frameX = 0;
      }

      if (finishedNPC.name === "wizard") {
        // freeze player
        player.canMove = false;
      
        // show wizard choice menu
        dialogueState.choiceActive = true;
        dialogueState.choices = [
          { 
            text: "Follow the King", 
            action: () => {
              console.log("Player chose the King path");
              gameState.pathChosen = "king";
              // Start fade for Castle path
          gameState.nextScene = "forest3";        // scene to load
          gameState.fadeTextScene = "forestPath"; // text to show during fade
          gameState.fadeActive = true;
          gameState.fadeDirection = 1;
          player.canMove = true;

          dialogueState.choiceActive = false;
          // player.canMove stays false until fade completes
            }
          },
          { 
            text: "Protect the Forest", 
            action: () => {
              console.log("Player chose the Forest path");
              gameState.pathChosen = "forest";
              // Start fade for Forest path
          gameState.nextScene = "castle";          // scene to load
          gameState.fadeTextScene = "castlePath";   // text to show during fade
          gameState.fadeActive = true;
          gameState.fadeDirection = 1;
          player.canMove = true;

          dialogueState.choiceActive = false;
          // player.canMove stays false until fade completes
            }
          }
        ];
        dialogueState.selectedChoice = 0;
      
        // stop dialogue box from rendering now
        dialogueState.chattingWithNPC = null;
      
        // exit early — don’t reset player.canMove yet
        return;
      }

// After finishing system dialogue
if (
  !dialogueState.active &&
  gameState.justCollectedRune &&
  !gameState.fadeActive
) {

  // FOREST 1 → FOREST 2
  if (gameState.currentScene === "forest") {
    gameState.fadeActive = true;
    gameState.fadeDirection = 1;
    gameState.nextScene = "forest2";
    gameState.fadeTextScene = "runeCollected";

    gameState.fadeTextTimer = 0;
    gameState.fadeTextOpacity = 0;
    gameState.triggerWizardOnload = true;
  }

  // FOREST 3 → ORC THRONE ROOM
  else if (gameState.currentScene === "forest3") {
    gameState.fadeActive = true;
    gameState.fadeDirection = 1;
    gameState.nextScene = "orcThroneRoom";
    gameState.fadeTextScene = "rune3Collected";

    gameState.fadeTextTimer = 0;
    gameState.fadeTextOpacity = 0;
  }

  // RETURN TO THRONE WITH RUNES
  else if (gameState.currentScene === "orcThroneRoom") {
    gameState.fadeActive = true;
    gameState.fadeDirection = 1;
    gameState.nextScene = "throneRoom";
    gameState.fadeTextScene = "returningWithRune";

    gameState.fadeTextTimer = 0;
    gameState.fadeTextOpacity = 0;

    // CRITICAL: consume the trigger
    gameState.justCollectedRune = false;
  }
}

// Trigger wizard fade-in after collecting second rune in forest2
if (
  !dialogueState.active &&
  gameState.justCollectedRune?.name === "Rune of Umbra" &&
  !gameState.wizardSpawned
) {
  console.log("Wizard spawn triggered!");

  gameState.wizardSpawned = true;

  // Spawn wizard to the right of player
  wizard.worldX = player.worldX + 220;
  wizard.y = player.y;

  // Start fade-in
  wizard.alpha = 0;
  wizard.state = "fading";

  // Lock player while wizard is fading in
  player.canMove = false;

  // Clear the rune trigger
  gameState.justCollectedRune = null;
}
      

    }

    dialogueState.chattingWithNPC = null;
    player.canMove = true;
  }
}



export function updateDialogue() {
  if (!dialogueState.chattingWithNPC) return;

  const now = performance.now();

  // --- Typewriter effect (time-based) ---
  if (!dialogueState.typingFinished) {
    if (now - dialogueState.lastTextUpdate >= dialogueState.textSpeed) {
      dialogueState.displayedText += dialogueState.dialogueText[dialogueState.textIndex];
      dialogueState.textIndex++;
      dialogueState.lastTextUpdate = now;

      if (dialogueState.textIndex >= dialogueState.dialogueText.length) {
        dialogueState.typingFinished = true;
        dialogueState.enterPromptVisible = true;
        dialogueState.lastPromptToggle = now;
      }
    }
  }

  // --- Flashing "Press Enter" (time-based) ---
  if (dialogueState.typingFinished) {
    if (now - dialogueState.lastPromptToggle >= dialogueState.enterPromptFlashRate) {
      dialogueState.enterPromptVisible = !dialogueState.enterPromptVisible;
      dialogueState.lastPromptToggle = now;
    }
  }
}



export function drawSpeechBubbles() {
  // Draw priest bubble
  if (gameState.currentScene === "forest" && priest.showBubble && dialogueState.chattingWithNPC !== priest) {
    const bubbleX = priest.worldX - gameState.cameraX + (priest.width - speechBubble.width) / 2;
    const bubbleY = priest.y + spriteOffsetY - speechBubble.height + 110;
    ctx.drawImage(speechBubble.sprite, bubbleX, bubbleY, speechBubble.width, speechBubble.height);
  }

  // Draw armored orc bubbles
  if (gameState.currentScene === "forest") {
    armoredOrcs.forEach(orc => {
      if (!orc.showBubble || dialogueState.chattingWithNPC === orc) return;

      const bubbleX = orc.worldX - gameState.cameraX + (orc.width - speechBubble.width) / 2;
      const bubbleY = orc.y + spriteOffsetY - speechBubble.height + 110;

      ctx.drawImage(speechBubble.sprite, bubbleX, bubbleY, speechBubble.width, speechBubble.height);
    });
  }

  // Draw king bubble
  if (gameState.currentScene === "throneRoom" && king.showBubble && dialogueState.chattingWithNPC !== king) {
    const bubbleX = king.worldX + (king.width - speechBubble.width) / 2;
    const bubbleY = king.y + spriteOffsetY - speechBubble.height + 110;
    ctx.drawImage(speechBubble.sprite, bubbleX, bubbleY, speechBubble.width, speechBubble.height);
  }

  if (gameState.currentScene === "forest2" && archer.showBubble && dialogueState.chattingWithNPC !== archer) {
    const bubbleX = archer.worldX - gameState.cameraX + (archer.width - speechBubble.width) / 2;
    const bubbleY = archer.y + spriteOffsetY - speechBubble.height + 110;
  
    ctx.drawImage(speechBubble.sprite, bubbleX, bubbleY, speechBubble.width, speechBubble.height);
  }

  // Draw armored skeleton bubbles
if (gameState.currentScene === "forest2") {
  armoredSkeletons.forEach(skel => {
    if (!skel.showBubble || dialogueState.chattingWithNPC === skel) return;

    const bubbleX = skel.worldX - gameState.cameraX + (skel.width - speechBubble.width) / 2;
    const bubbleY = skel.y + spriteOffsetY - speechBubble.height + 110;

    ctx.drawImage(speechBubble.sprite, bubbleX, bubbleY, speechBubble.width, speechBubble.height);
  });
}

// Draw wizard bubble
if (gameState.currentScene === "forest2" && wizard.showBubble && dialogueState.chattingWithNPC !== wizard) {
  const bubbleX = wizard.worldX - gameState.cameraX + (wizard.width - speechBubble.width) / 2;
  const bubbleY = wizard.y + spriteOffsetY - speechBubble.height + 110;

  ctx.drawImage(speechBubble.sprite, bubbleX, bubbleY, speechBubble.width, speechBubble.height);
}

// Draw castle guide bubble
if (gameState.currentScene === "castle" && castleNPC.showBubble && dialogueState.chattingWithNPC !== castleNPC) {
  const bubbleX = castleNPC.worldX - gameState.cameraX + (castleNPC.width - speechBubble.width) / 2;
  const bubbleY = castleNPC.y + spriteOffsetY - speechBubble.height + 110;

  ctx.drawImage(speechBubble.sprite, bubbleX, bubbleY, speechBubble.width, speechBubble.height);
}

// Draw lancer bubble
if (gameState.currentScene === "forest3" && lancer.showBubble && dialogueState.chattingWithNPC !== lancer) {
  const bubbleX = lancer.worldX - gameState.cameraX + (lancer.width - speechBubble.width) / 2;
  const bubbleY = lancer.y + spriteOffsetY - speechBubble.height + 80;

  ctx.drawImage(speechBubble.sprite, bubbleX, bubbleY, speechBubble.width, speechBubble.height);
}

if (gameState.currentScene === "forest3") {
  werebears.forEach(bear => {
    if (!bear.showBubble || dialogueState.chattingWithNPC === bear) return;

    const bubbleX = bear.worldX - gameState.cameraX + (bear.width - speechBubble.width) / 2;
    const bubbleY = bear.y + spriteOffsetY - speechBubble.height + 110;

    ctx.drawImage(speechBubble.sprite, bubbleX, bubbleY, speechBubble.width, speechBubble.height);
  });
}

// Draw orc king bubble
if (gameState.currentScene === "orcThroneRoom" && orcKing.showBubble && dialogueState.chattingWithNPC !== orcKing) {
  const bubbleX = orcKing.worldX + (orcKing.width - speechBubble.width) / 2;
  const bubbleY = orcKing.y + spriteOffsetY - speechBubble.height + 70;

  ctx.drawImage(speechBubble.sprite, bubbleX, bubbleY, speechBubble.width, speechBubble.height);
}
  
}




// Draw the dialogue box and text
export function drawDialogueArea() {
  if (!dialogueState.chattingWithNPC) return;
  ctx.save();

  const padding = 20;
  const areaHeight = 150;
  const areaWidth = canvas.width - 200;
  const areaX = 100;
  const areaY = 150;

  // Background
  ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  ctx.fillRect(areaX, areaY, areaWidth, areaHeight);

  // Rounded border
  const radius = 10;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  roundRect(ctx, areaX, areaY, areaWidth, areaHeight, radius, false, true);

  ctx.font = "18px 'Press Start 2P'";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  let yOffset = areaY + padding;

  const currentLineObj = dialogueState.dialogueQueue[dialogueState.currentLineIndex];

  if (!currentLineObj) return;

  if (currentLineObj.type === "speaker") {
    ctx.fillStyle = "#00f0ff"; // speaker name in bright blue
    ctx.fillText(currentLineObj.speaker + ":", areaX + padding, yOffset);
    yOffset += 30;

    ctx.fillStyle = "white"; // dialogue text
    wrapAndDrawText(dialogueState.displayedText, areaX + padding, yOffset, areaWidth - padding * 2, 24);
  } else if (currentLineObj.type === "system") {
    ctx.fillStyle = "yellow";
    wrapAndDrawText(dialogueState.displayedText, areaX + padding, yOffset, areaWidth - padding * 2, 24);
  }

  // enter prompt
  if (dialogueState.typingFinished  && dialogueState.enterPromptVisible) {
    const promptText = "Press Enter"
    ctx.fillStyle = "yellow";
    ctx.font = "16px 'Press Start 2P'";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    const promptX = areaX + areaWidth - 20;  // 20px padding from right
  const promptY = areaY + areaHeight - 10; // 10px padding from bottom
  ctx.fillText(promptText, promptX, promptY);
  }

  ctx.restore();
}

// Helper: wrap long text lines
export function wrapAndDrawText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

// Check if player is close enough to talk
export function checkNPCProximity() {
  let sceneNPCs = [];

  if (gameState.currentScene === "forest") sceneNPCs = [priest, ...armoredOrcs];
  else if (gameState.currentScene === "throneRoom") sceneNPCs = [king];
  else if (gameState.currentScene === "forest2") sceneNPCs = [archer, ...armoredSkeletons, wizard];
  else if (gameState.currentScene === "castle") sceneNPCs = [castleNPC];
  else if (gameState.currentScene === "forest3") sceneNPCs = [lancer, ...werebears];
  else if (gameState.currentScene === "orcThroneRoom") sceneNPCs = [orcKing];

  sceneNPCs.forEach(npc => {
    if (!npc || !npc.dialogue) return;

    const dx = player.worldX - npc.worldX;
    const dy = player.y - npc.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (!dialogueState.chattingWithNPC && !npc.dialogueFinished && distance <= talkRadius && npc.showBubble) {
      startDialogue(npc);
      npc.showBubble = false;
    }
  });
}


// Draw dialogue UI (speech bubbles + dialogue box)
export function drawDialogueUI() {
  drawSpeechBubbles();
  if (dialogueState.chattingWithNPC) {
    drawDialogueArea();
  }
  if (dialogueState.choiceActive) {
    drawChoiceMenu();
  }
}
