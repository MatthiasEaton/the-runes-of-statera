import { ctx, canvas } from "../core/config.js";
import { player, playerActions } from "../entities/player.js";
import { gameState } from "../core/game.js";
import { resetCurrentSceneEnemies } from "../entities/enemies.js";
import { inventoryItems } from "../ui/inventory.js";
import { runes } from "../entities/npc.js";
import { swordImg } from "../core/assets.js";
import { priest, king, orcKing, archer, wizard, castleNPC, lancer } from "../entities/npc.js";
import { werebears } from "../entities/forest3Enemies.js";
import { dialogueState } from "../ui/dialogue.js";






let creditsY = canvas.height / 2;

let delay = 120; // frames (~2 seconds)

let creditsFinished = false;

let endingStarted = false;

let totalCreditsHeight = 0;


const credits = [
    { type: "title", text: "The Runes of Statera" },
  
    { type: "space" },
    { type: "space" },
    { type: "space" },
    { type: "space" },
  
    { type: "header", text: "Created By" },
    { type: "text", text: "Matthias Eaton" },
  
    { type: "space" },
  
    { type: "header", text: "Art & Assets" },
    { type: "text", text: "Eder Muniz – Forest Pixel Art" },
    { type: "text", text: "Brackeys – Platformer Bundle" },
    { type: "text", text: "PixelTier – Tiny RPG Assets" },
    { type: "text", text: "Zerie – RPG Character Pack" },
    { type: "text", text: "Bragorn – Inventory Sprites" },
    { type: "text", text: "LucaPixel – Icons" },
    { type: "text", text: "Freepik – Favicon art" },
  
    { type: "space" },
  
    { type: "header", text: "UI & Graphics" },
    { type: "text", text: "PNGTree – Inventory Bag Icon" },
    { type: "text", text: "Daniel Eka – Settings Gear Icon" },
    { type: "text", text: "Freepik – Ornate Border Design" },
  
    { type: "space" },
  
    { type: "header", text: "Fonts" },
    { type: "text", text: "Press Start 2P – Google Fonts" },
    { type: "text", text: "Cinzel – Google Fonts" },
  
    { type: "space" },
  
    { type: "header", text: "Tools & Resources" },
    { type: "text", text: "Piskel – Sprite Editor" },
    { type: "text", text: "PixAI – Image Generation" },
    { type: "text", text: "1001 Fonts – Font Resources" },
  
    { type: "space" },

    { type: "header", text: "Music" },
    { type: "text", text: "The Sound Guild" },
  
    { type: "space" },
  
    { type: "header", text: "Development Support" },
    { type: "text", text: "ChatGPT – Programming Assistance" },
  
    { type: "space" },
    { type: "space" },
  
    { type: "text", text: "Thank you for playing!" }
  ];

  export function drawCredits() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    ctx.textAlign = "center";
  
    let y = creditsY;
  
    credits.forEach(item => {
      if (item.type === "title") {
        ctx.font = "64px Cinzel";
        ctx.fillStyle = "white";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 20;
  
        ctx.fillText(item.text, canvas.width / 2, y);
        y += 100;
      }
  
      else if (item.type === "header") {
        ctx.font = "28px Cinzel";
        ctx.fillStyle = "gold";
        ctx.fillText(item.text, canvas.width / 2, y);
        y += 50;
      }
  
      else if (item.type === "text") {
        ctx.font = "20px Cinzel";
        ctx.fillStyle = "white";
        ctx.fillText(item.text, canvas.width / 2, y);
        y += 40;
      }
  
      else if (item.type === "space") {
        y += 80;
      }
    });
  }

  credits.forEach(item => {
    if (item.type === "title") totalCreditsHeight += 100;
    else if (item.type === "header") totalCreditsHeight += 50;
    else if (item.type === "text") totalCreditsHeight += 40;
    else if (item.type === "space") totalCreditsHeight += 80;
  });

  export function updateCredits() {

    if (gameState.fadeActive) return;

    if (endingStarted) return; // FREEZE EVERYTHING
  
    if (delay > 0) {
      delay--;
      return;
    }
  
    creditsY -= 0.9;
  
    const endY = creditsY + totalCreditsHeight;

if (endY < 0 && !creditsFinished) {
  creditsFinished = true;
  endingStarted = true;
  startCreditsEnd();
}
  }

  function startCreditsEnd() {
    gameState.fadeActive = true;
    gameState.fadeDirection = 1; // fade to black
    gameState.nextScene = "startScreen";
  }

  function resetPlayer() {
    player.worldX = 100;

    player.isDead = false;
    player.deathAnimationDone = false;
    player.isAttacking = false;
  
    player.level = 1;
    player.xp = 0;
    player.attackDamage = 20;
    player.xpToNextLevel = 100;
    player.maxHealth = 100;
    player.health = player.maxHealth;
  
    player.state = "idle";
    player.frameX = 0;
    player.frameY = playerActions.idle.row;
  
    player.vx = 0;
    player.vy = 0;
  }

  function resetWorld() {
    gameState.cameraX = 0;
    gameState.gameOver = false;

    gameState.fadeActive = false;
    gameState.fadeOpacity = 0;
    gameState.fadeDirection = 1;
    gameState.fadeTextActive = false;
    gameState.fadeText = "";
    gameState.fadeTextScene = null;
    gameState.fadeTextTimer = 0;
    gameState.fadeTextOpacity = 0;
    gameState.justCollectedRune = null;

    if (window.keys) {
      window.keys.Enter = false;
    }
  }

  function resetEnemies() {
    resetCurrentSceneEnemies("forest");
    resetCurrentSceneEnemies("castle");
    resetCurrentSceneEnemies("forest2");
    resetCurrentSceneEnemies("forest3");
  }

  export function resetInventory() {
    inventoryItems.length = 0;
  
    inventoryItems.push({
      img: swordImg,
      name: "Iron Sword",
      type: "weapon",
      properties: { damage: 20 }
    });
  }

  function resetStoryFlags() {
    gameState.storyProgress = "start";
    gameState.postCastleBoss = false;
    gameState.postRunesCollected = false;
    gameState.wizardSpawned = false;
  }

  function resetNPCs() {
    runes.forEach(rune => {
      rune.collected = false;
      rune.canCollect = false;
      rune.spawnTime = performance.now();
    });
    king.dialogueFinished = false;
    orcKing.dialogueFinished = false;
    priest.dialogueFinished = false;
    archer.dialogueFinished = false;
    castleNPC.dialogueFinished = false;
    lancer.dialogueFinished = false;
    werebears.dialogueFinished = false;
  }

  function resetUI() {
    creditsY = canvas.height / 2;
    delay = 120;
    creditsFinished = false;
    endingStarted = false;
  
    gameState.fadeActive = false;
    gameState.fadeOpacity = 0;
    gameState.fadeTextActive = false;
    gameState.nextScene = null;
  }

  function resetRunes() {
    runes.length = 0;
  }

  export function resetWizard() {
    wizard.state = "hidden";
    wizard.alpha = 0;
  
    wizard.worldX = 0;
    wizard.y = 0;
  
    wizard.frameX = 0;
    wizard.frameY = 0;
    wizard.frameTimer = 0;
  
    wizard.showBubble = false;
    wizard.dialogueFinished = false;

    dialogueState.choiceActive = false;
    dialogueState.choices = [];
    dialogueState.selectedChoice = 0;
    dialogueState.chattingWithNPC = null;
  }

  export function resetGameStateForNewRun() {
    resetPlayer();
    resetWorld();
    resetEnemies();
    resetNPCs();
    resetInventory();
    resetRunes();
    resetUI();
    resetStoryFlags();
    resetWizard();
  }
