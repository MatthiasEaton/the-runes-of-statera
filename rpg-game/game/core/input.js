import { canvas, inventoryUI } from "../core/config.js";
import { player, playerActions } from "../entities/player.js";
import { advanceDialogue, dialogueState } from "../ui/dialogue.js";
import { bagPadding, bagSize, inventoryItems, cols, slotStartX, slotStartY, slotSpacing, slotSize, modalX, modalY, modalWidth, modalCloseSize, discardItem, discardModal } from "../ui/inventory.js";
import { gameState, restartGame } from "../core/game.js";
import { tree } from "../world/map.js";
import { toggleInventory, deselectItem } from "../ui/inventory.js";
import { inventoryVariables } from "../ui/inventory.js";
import { startIntroSequence } from "../scenes/startScreen.js";
import { toggleSettings, settingsOpen, settingsUI, toggleMute } from "../ui/settings.js";
import { music } from "../core/audio.js";


// close modal
deselectItem();

// --- Global mouse tracking ---
export let mouseX = 0;
export let mouseY = 0;

// --- Hover detection ---
function isHovering(x, y, w, h) {
  return (
    mouseX >= x &&
    mouseX <= x + w &&
    mouseY >= y &&
    mouseY <= y + h
  );
}

export function updateCursor() {
  let hovering = false;

  const iconGap = 10;

  // --- Settings icon ---
  const settingsX = canvas.width - bagPadding - bagSize * 2 - iconGap;
  const settingsY = bagPadding;

  if (isHovering(settingsX, settingsY, bagSize, bagSize)) {
    hovering = true;
  }

  // --- Settings UI ---
  if (settingsOpen) {
    if (isHovering(settingsUI.closeX, settingsUI.closeY, settingsUI.closeSize, settingsUI.closeSize)) {
      hovering = true;
    }

    if (settingsUI.muteBtn) {
      const b = settingsUI.muteBtn;
      if (isHovering(b.x, b.y, b.w, b.h)) {
        hovering = true;
      }
    }
  }

  // --- Inventory icon ---
  const bagX = canvas.width - bagPadding - bagSize;
  const bagY = bagPadding;

  if (isHovering(bagX, bagY, bagSize, bagSize)) {
    hovering = true;
  }

  // --- Inventory UI ---
  if (inventoryVariables.inventoryOpen) {
    const closeX = inventoryUI.x + inventoryUI.width - inventoryUI.closeSize + 50;
    const closeY = inventoryUI.y;

    if (isHovering(closeX, closeY, inventoryUI.closeSize, inventoryUI.closeSize)) {
      hovering = true;
    }
  }

  // --- Inventory slots ---
if (
  inventoryVariables.inventoryOpen &&
  inventoryVariables.selectedItem === null
) {
  for (let i = 0; i < inventoryItems.length; i++) {
    const slotX = slotStartX + (i % cols) * slotSpacing;
    const slotY = slotStartY + Math.floor(i / cols) * slotSpacing;

    if (isHovering(slotX, slotY, slotSize, slotSize)) {
      hovering = true;
      break; // stop early for performance
    }
  }
}

  // --- Modal buttons ---
  if (inventoryVariables.selectedItem !== null) {
    if (isHovering(discardModal.buttonX, discardModal.buttonY, discardModal.buttonWidth, discardModal.buttonHeight)) {
      hovering = true;
    }

    if (isHovering(discardModal.drinkButtonX, discardModal.drinkButtonY, discardModal.drinkButtonWidth, discardModal.drinkButtonHeight)) {
      hovering = true;
    }
  }

  // --- Dialogue choices ---
  if (dialogueState.choiceActive) {
    dialogueState.choices.forEach(choice => {
      if (!choice.rect) return;
      if (isHovering(choice.rect.x, choice.rect.y, choice.rect.width, choice.rect.height)) {
        hovering = true;
      }
    });
  }

  // --- Apply cursor ---
  canvas.style.cursor = hovering ? "pointer" : "default";
}

// Track keys being pressed
export const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  Space: false,
  Attack: false
};

// --- Keydown listener ---
document.addEventListener("keydown", (e) => {

  // --- Start screen ---
  if (gameState.currentScene === "startScreen" && e.code === "Enter") {
    if (!gameState.fadeActive) {
      startIntroSequence();
    }
    return;
  }

  // --- Level-up screen dismiss ---
  if (gameState.levelUpActive && e.code === "Enter") {
    gameState.levelUpActive = false;
  }

  // --- Level-up screen dismiss ---
if (gameState.levelUpActive && e.code === "Enter") {
    gameState.levelUpActive = false;
    // Optionally resume gameplay here if needed
}
// --- If level-up screen is active, ignore all other input ---
if (gameState.levelUpActive) return;
  
  // --- Movement keys ---
  if (e.code === "ArrowLeft") keys.ArrowLeft = true;
  if (e.code === "ArrowRight") keys.ArrowRight = true;

  // --- Jump ---
  if (e.code === "Space") keys.Space = true;

  // --- Attack ---
  if (e.code === "KeyX" && !player.isAttacking) {
    player.isAttacking = true;
    player.attackHit = false;
    player.frameX = 0;
    player.state = "attack";
    player.frameY = playerActions.attack.row;
    player.maxFrames = playerActions.attack.frames;
  }

  // --- Dialogue advance ---
if (dialogueState.chattingWithNPC && e.key === "Enter") {
  advanceDialogue(); // This already handles incrementing the line and ending dialogue
}

});

// --- Keyup listener ---
document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft") keys.ArrowLeft = false;
  if (e.code === "ArrowRight") keys.ArrowRight = false;
  if (e.code === "Space") keys.Space = false;
});


canvas.addEventListener("click", (e) => {
  // --- Update global mouse coordinates ---
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  mouseX = (e.clientX - rect.left) * scaleX;
  mouseY = (e.clientY - rect.top) * scaleY;

  // --- 1. Settings icon toggle (highest priority) ---
const iconGap = 10;
const settingsX = canvas.width - bagPadding - bagSize * 2 - iconGap;
const settingsY = bagPadding;

if (
  mouseX >= settingsX &&
  mouseX <= settingsX + bagSize &&
  mouseY >= settingsY &&
  mouseY <= settingsY + bagSize
) {
  console.log("Settings icon clicked");
  toggleSettings(); // 👈 we'll hook this up
  return; // stop further processing
}

// --- Settings close button ---
if (settingsOpen) {
  const closeX = settingsUI.closeX;
  const closeY = settingsUI.closeY;
  const size = settingsUI.closeSize;

  if (
    mouseX >= closeX &&
    mouseX <= closeX + size &&
    mouseY >= closeY &&
    mouseY <= closeY + size
  ) {
    toggleSettings();
    return;
  }
}

// --- mute toggle ---
if (settingsOpen && settingsUI.muteBtn) {
  const b = settingsUI.muteBtn;

  if (
    mouseX >= b.x &&
    mouseX <= b.x + b.w &&
    mouseY >= b.y &&
    mouseY <= b.y + b.h
  ) {
    music.toggleMute();
    toggleMute();
    return;
  }
}

  // --- 2. Bag icon toggle (highest priority) ---
  const bagX = canvas.width - bagPadding - bagSize;
  const bagY = bagPadding;
  if (mouseX >= bagX && mouseX <= bagX + bagSize &&
      mouseY >= bagY && mouseY <= bagY + bagSize) {
    toggleInventory();
    return; // Stop further processing
  }

// --- 3. Inventory close button (top-right X) ---
if (inventoryVariables.inventoryOpen) {
  console.log("Close inventory button clicked");
  const closeX = inventoryUI.x + inventoryUI.width - inventoryUI.closeSize + 50;
  const closeY = inventoryUI.y;
  const closeSize = inventoryUI.closeSize;
  if (mouseX >= closeX && mouseX <= closeX + closeSize &&
      mouseY >= closeY && mouseY <= closeY + closeSize) {
    
    // Close inventory
    inventoryVariables.inventoryOpen = false; // force it closed
    inventoryVariables.selectedItem = null;   // clear modal selection
    inventoryVariables.warningMessage = "";   // clear warnings
    
    return; // stop further processing
  }
}



  // --- 4. Modal close button ---
  if (inventoryVariables.selectedItem !== null) {
    const modalCloseX = modalX + modalWidth - modalCloseSize - 10;
    const modalCloseY = modalY + 10;
    if (mouseX >= modalCloseX && mouseX <= modalCloseX + modalCloseSize &&
        mouseY >= modalCloseY && mouseY <= modalCloseY + modalCloseSize) {
      inventoryVariables.selectedItem = null;
      inventoryVariables.warningMessage = "";
      return;
    }
  }

  // --- 5. Click inventory slots (only if inventory open and no modal active) ---
  if (inventoryVariables.inventoryOpen && inventoryVariables.selectedItem === null) {
    for (let i = 0; i < inventoryItems.length; i++) {
      const slotX = slotStartX + (i % cols) * slotSpacing;
      const slotY = slotStartY + Math.floor(i / cols) * slotSpacing;
      if (mouseX >= slotX && mouseX <= slotX + slotSize &&
          mouseY >= slotY && mouseY <= slotY + slotSize) {
        inventoryVariables.selectedItem = i; // store index
        console.log("Selected item:", inventoryItems[i].name);
        inventoryVariables.selectedItem = i;
        return; // stop after selecting one
      }
    }
  }

  // --- 6. Drink button click (only if modal active) ---
if (inventoryVariables.selectedItem !== null) {
  if (
    mouseX >= discardModal.drinkButtonX &&
    mouseX <= discardModal.drinkButtonX + discardModal.drinkButtonWidth &&
    mouseY >= discardModal.drinkButtonY &&
    mouseY <= discardModal.drinkButtonY + discardModal.drinkButtonHeight
  ) {
    console.log("Drink button clicked");

    const itemIndex = inventoryVariables.selectedItem;
    const item = inventoryItems[itemIndex];

    // Only allow drinking potions
    if (item.type === "potion") {
      // Check if player is already full health
      if (player.health >= player.maxHealth) {
        inventoryVariables.warningMessage = "Health is already full!";
        inventoryVariables.warningTimer = 120; // frames to display warning
        inventoryVariables.warningForDrink = true; // flag for positioning
      } else {
        // Heal player
        player.health += item.properties.heal || 0;
        if (player.health > player.maxHealth) player.health = player.maxHealth;

        // Remove potion from inventory
        inventoryItems.splice(itemIndex, 1);

        // Close modal after using potion
        inventoryVariables.selectedItem = null;

        // Reset warning flag just in case
        inventoryVariables.warningForDrink = false;
      }
    }

    return;
  }
}


  // --- 7. Discard button click (only if modal active) ---
  if (inventoryVariables.selectedItem !== null) {
  if (mouseX >= discardModal.buttonX &&
      mouseX <= discardModal.buttonX + discardModal.buttonWidth &&
      mouseY >= discardModal.buttonY &&
      mouseY <= discardModal.buttonY + discardModal.buttonHeight) {

    console.log("Discard button clicked");

    const itemIndex = inventoryVariables.selectedItem;

    // Call discardItem, but check if warning is set
    discardItem(itemIndex);

    if (!inventoryVariables.warningMessage) {
      // Only close modal if there’s no warning
      inventoryVariables.selectedItem = null;
    }

    return;
  }
}


  // --- 8. Click outside to deselect (inventory open) ---
  if (inventoryVariables.inventoryOpen && inventoryVariables.selectedItem === null) {
    inventoryVariables.selectedItem = null;
  }

  // --- 9. Game restart if player is dead ---
  if (gameState.gameOver) {
    restartGame();
  }

  // --- 10. Choice menu clicks (VERY IMPORTANT: put near top priority if needed) ---
if (dialogueState.choiceActive) {
  dialogueState.choices.forEach(choice => {
    if (!choice.rect) return;

    const { x, y, width, height } = choice.rect;

    const clicked =
      mouseX >= x &&
      mouseX <= x + width &&
      mouseY >= y &&
      mouseY <= y + height;

    if (clicked) {
      console.log("Clicked choice:", choice.text);

      handleChoiceSelection(choice);

      return; // stop after click
    }
  });

  return; // 🚨 IMPORTANT: stop other click logic when menu is open
}
});

function handleChoiceSelection(choice) {
  console.log("Player chose:", choice.text);

  if (choice.action) {
    choice.action(); // 🔥 THIS is the key
  }
}


canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  mouseX = (e.clientX - rect.left) * scaleX;
  mouseY = (e.clientY - rect.top) * scaleY;
});


export function handlePlayerMovement(scene = "forest") {
  if (gameState.isLocked) return;
  if (!player.canMove) return;

  let moved = false;

  let minX = 0;
  let maxX = canvas.width - player.width;

  const WORLD_WIDTH = 17000;

  if (scene === "forest") {
    // Original forest logic with tree and scrolling
    const treeRight = tree.worldX + tree.width * tree.scale;
    if (keys.ArrowLeft) {
      const potentialX = player.worldX - player.speed;
      if (potentialX > treeRight) {
        player.worldX = potentialX;
        moved = true;
      }
    }
    if (keys.ArrowRight) {
      player.worldX = Math.min(player.worldX + player.speed, WORLD_WIDTH - player.width);
      moved = true;
    }
    // Background scrolling handled elsewhere
  } else {
    // Single-room scene (like throne room)
    if (keys.ArrowLeft) {
      player.worldX = Math.max(player.worldX - player.speed, minX);
      moved = true;
    }
    if (keys.ArrowRight) {
      player.worldX = Math.min(player.worldX + player.speed, maxX);
      moved = true;
    }
  }

  // Update camera only if player actually moved
  // Optional: you can skip cameraX changes entirely for throneRoom
  if (scene === "forest" && moved) {
    const cameraMargin = 50;
  
    if (player.worldX - gameState.cameraX < cameraMargin) {
      gameState.cameraX = player.worldX - cameraMargin;
    } else if (
      player.worldX - gameState.cameraX >
      canvas.width - player.width - cameraMargin
    ) {
      gameState.cameraX =
        player.worldX - (canvas.width - player.width - cameraMargin);
    }
  
    // 🔥 CLAMP HERE (this is the key fix)
    gameState.cameraX = Math.max(
      0,
      gameState.cameraX
    );
  }

  // --- Update direction ---
  if (keys.ArrowLeft) player.direction = "left";
  else if (keys.ArrowRight) player.direction = "right";

  // Update screenX for drawing
  player.x = player.worldX - (scene === "forest" ? gameState.cameraX : 0);
}
