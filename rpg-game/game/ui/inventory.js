import { canvas, ctx } from "../core/config.js";
import { mouseX, mouseY } from "../core/input.js";
import { inventoryImg, swordImg, healingPotionImg } from "../core/assets.js";
import { inventoryUI } from "../core/config.js";
import { rune4 } from "../core/assets.js";

export const inventoryVariables = {
inventoryOpen: false,
selectedItem: null,
hoveredItemIndex: null,
clickedItemIndex: null,
warningMessage: "",
warningTimer: 0,
}

export let inventoryItems = [
  { 
    img: swordImg,
    name: "Iron Sword",
    type: "weapon",
    properties: { damage: 20 }
  }
];

export function givePotions(amount) {
  // Find last index of sword or any existing healing potions
  let insertIndex = inventoryItems.findIndex(item => item.name === "Iron Sword") + 1;

  // Move past any existing potions directly after the sword
  while (
    insertIndex < inventoryItems.length &&
    inventoryItems[insertIndex].name === "Healing Potion"
  ) {
    insertIndex++;
  }

  for (let i = 0; i < amount; i++) {
    // Insert each potion at the current insertIndex
    inventoryItems.splice(insertIndex, 0, { 
      img: healingPotionImg,
      name: "Healing Potion",
      type: "potion",
      properties: { heal: 50 }
    });
    insertIndex++; // move to next slot for next potion
  }

  console.log(`Added ${amount} healing potions`, inventoryItems);
}

export function giveRune() {
  // Prevent duplicates
  if (inventoryItems.some(item => item.name === "Rune of Lumen")) return;

  // Insert AFTER sword (same logic as potions)
  let insertIndex = inventoryItems.findIndex(item => item.name === "Iron Sword") + 1;

  // Skip past any existing potions (same structure as your system)
  while (
    insertIndex < inventoryItems.length &&
    inventoryItems[insertIndex].name === "Healing Potion"
  ) {
    insertIndex++;
  }

  // Insert the rune
  inventoryItems.splice(insertIndex, 0, {
    img: rune4,
    name: "Rune of Lumen",
    type: "keyItem"
  });

  console.log("Added Rune of Lumen", inventoryItems);
}


export const bagSize = 50;
export const bagPadding = 20;
export const slotStartX = inventoryUI.x + 50;
export const slotStartY = inventoryUI.y + 50;
export const slotSize = 50;
export const slotSpacing = 115;
export const cols = 4;
export const modalWidth = 300;
export const modalHeight = 200;
export const modalX = canvas.width / 2 - modalWidth / 2;
export const modalY = canvas.height / 2 - modalHeight / 2;
export const modalCloseSize = 25;
export const discardModal = { width: 300, height: 200, buttonWidth: 120, buttonHeight: 40, buttonX: 0, buttonY: 0, closeX: 0, closeY: 0, closeSize: modalCloseSize };

export const closeButton = { x: inventoryUI.x + inventoryUI.width - 50, y: inventoryUI.y, width: 40, height: 40 };

export function toggleInventory() {
  inventoryVariables.inventoryOpen = !inventoryVariables.inventoryOpen;
  if (!inventoryVariables.inventoryOpen) inventoryVariables.selectedItem = null;
}

export function selectItem(index) {
  inventoryVariables.selectedItem = index;
}

export function deselectItem() {
  inventoryVariables.selectedItem = null;
  inventoryVariables.warningMessage = "";
}

inventoryItems.forEach((item, i) => {
  console.log(`Drawing slot ${i}: ${item.name}, img =`, item.img);
  const slotX = slotStartX + (i % cols) * slotSpacing;
  const slotY = slotStartY + Math.floor(i / cols) * slotSpacing;
  ctx.drawImage(item.img, slotX, slotY, slotSize, slotSize);
});


// --- Draw inventory ---
export function drawInventory() {
  if (!inventoryVariables.inventoryOpen) return;

  ctx.save();

  // --- Overlay ---
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // --- Background ---
  ctx.drawImage(inventoryImg, inventoryUI.x, inventoryUI.y, inventoryUI.width, inventoryUI.height);

  // --- Close button ---
  drawInventoryCloseButton();

  // --- Draw slots & items ---
  inventoryVariables.hoveredItemIndex = null;
  inventoryItems.forEach((item, i) => {
    const slotX = slotStartX + (i % cols) * slotSpacing;
    const slotY = slotStartY + Math.floor(i / cols) * slotSpacing;

    // Draw item
    ctx.drawImage(item.img, slotX, slotY, slotSize, slotSize);

    // Hover effect
    if (mouseX >= slotX && mouseX <= slotX + slotSize &&
        mouseY >= slotY && mouseY <= slotY + slotSize) {
      inventoryVariables.hoveredItemIndex = i;
      ctx.save();
      ctx.shadowColor = "yellow";
      ctx.shadowBlur = 15;
      ctx.drawImage(item.img, slotX, slotY, slotSize, slotSize);
      ctx.restore();

      // Tooltip
      const tooltipText = [item.name];
      if (item.properties) {
        for (let prop in item.properties) tooltipText.push(`${prop}: ${item.properties[prop]}`);
      }

      const padding = 10;
      ctx.font = "18px sans-serif";
      ctx.textBaseline = "top";
      const tooltipWidth = Math.max(...tooltipText.map(t => ctx.measureText(t).width)) + padding * 2;
      const tooltipHeight = 22 * tooltipText.length + padding * 2;

      const tooltipX = mouseX + 20;
      const tooltipY = mouseY + 20;

      ctx.fillStyle = "rgba(0,0,0,0.85)";
      ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
      ctx.fillStyle = "white";
      tooltipText.forEach((text, idx) => {
        ctx.fillText(text, tooltipX + padding, tooltipY + padding + idx * 22);
      });
    }
  });

  

  // --- Discard modal ---
  drawDiscardModal();
  ctx.restore();
}

// Function to add item
export function addItem(itemImg) {
  if (inventoryItems.length < 16) { // max 4x4
    inventoryItems.push({ img: itemImg });
  } else {
    console.log("Inventory full!");
  }
}

// Draw inventory items
export function drawInventoryItems() {
  inventoryVariables.hoveredItemIndex = null; // reset each frame

  for (let i = 0; i < inventoryItems.length; i++) {
    const x = slotStartX + (i % cols) * slotSpacing;
    const y = slotStartY + Math.floor(i / cols) * slotSpacing;

    // Draw item
    ctx.drawImage(inventoryItems[i].img, x, y, slotSize, slotSize);

    // Hover effect
    if (
      mouseX >= x &&
      mouseX <= x + slotSize &&
      mouseY >= y &&
      mouseY <= y + slotSize
    ) {
      inventoryVariables.hoveredItemIndex = i;
      
      // Yellow glow
      ctx.save();
      ctx.shadowColor = "yellow";
      ctx.shadowBlur = 15;
      ctx.drawImage(inventoryItems[i].img, x, y, slotSize, slotSize);
      ctx.restore();

      // Tooltip with name & properties
const item = inventoryItems[i];
const tooltipText = [item.name];
for (let prop in item.properties) {
  tooltipText.push(`${prop}: ${item.properties[prop]}`);
}

ctx.font = "18px sans-serif";
ctx.textBaseline = "middle";

const padding = 12; // padding inside tooltip
const lineHeight = 24;

// Figure out widest line
const tooltipWidth =
  Math.max(...tooltipText.map(t => ctx.measureText(t).width)) + padding * 2;
const tooltipHeight = lineHeight * tooltipText.length + padding * 2;

// Offset tooltip from mouse
const tooltipX = mouseX + 20; // further to the right
const tooltipY = mouseY + 20; // further down

// Rounded background
ctx.fillStyle = "rgba(0,0,0,0.85)";
ctx.beginPath();
ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);
ctx.fill();

// Centered text
ctx.fillStyle = "white";
ctx.textAlign = "center"; // horizontal centering
tooltipText.forEach((text, index) => {
  const textX = tooltipX + tooltipWidth / 2;
  const textY =
    tooltipY + padding + index * lineHeight + lineHeight / 2; // center of each line
  ctx.fillText(text, textX, textY);
});

    }
  }
}

export function drawDrinkButton(item) {
  if (!item || item.type !== "potion") return;

  const btnWidth = discardModal.buttonWidth;
  const btnHeight = discardModal.buttonHeight;
  const btnX = modalX + (modalWidth / 2 - btnWidth / 2);
  const btnY = discardModal.buttonY - btnHeight - 25; // above discard button
  const radius = 6;

  ctx.save();

  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  ctx.fillStyle = "#28a745"; // green
  ctx.beginPath();
  ctx.moveTo(btnX + radius, btnY);
  ctx.lineTo(btnX + btnWidth - radius, btnY);
  ctx.quadraticCurveTo(btnX + btnWidth, btnY, btnX + btnWidth, btnY + radius);
  ctx.lineTo(btnX + btnWidth, btnY + btnHeight - radius);
  ctx.quadraticCurveTo(btnX + btnWidth, btnY + btnHeight, btnX + btnWidth - radius, btnY + btnHeight);
  ctx.lineTo(btnX + radius, btnY + btnHeight);
  ctx.quadraticCurveTo(btnX, btnY + btnHeight, btnX, btnY + btnHeight - radius);
  ctx.lineTo(btnX, btnY + radius);
  ctx.quadraticCurveTo(btnX, btnY, btnX + radius, btnY);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#1e7e34"; // darker green
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Drink", btnX + btnWidth / 2, btnY + btnHeight / 2);

  ctx.restore();

  // Store button position for click detection
  discardModal.drinkButtonX = btnX;
  discardModal.drinkButtonY = btnY;
  discardModal.drinkButtonWidth = btnWidth;
  discardModal.drinkButtonHeight = btnHeight;
}




export function drawDiscardButton() {
  if (inventoryVariables.selectedItem === null || inventoryVariables.selectedItem === undefined) return;


  const btnWidth = discardModal.buttonWidth;
  const btnHeight = discardModal.buttonHeight;
  const btnX = modalX + (modalWidth / 2 - btnWidth / 2);
  const btnY = modalY + modalHeight - btnHeight - 20;
  const radius = 6;

  ctx.save();

  // Shadow
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Button background with rounded corners
  ctx.fillStyle = "#e63939"; // nice red
  ctx.beginPath();
  ctx.moveTo(btnX + radius, btnY);
  ctx.lineTo(btnX + btnWidth - radius, btnY);
  ctx.quadraticCurveTo(btnX + btnWidth, btnY, btnX + btnWidth, btnY + radius);
  ctx.lineTo(btnX + btnWidth, btnY + btnHeight - radius);
  ctx.quadraticCurveTo(btnX + btnWidth, btnY + btnHeight, btnX + btnWidth - radius, btnY + btnHeight);
  ctx.lineTo(btnX + radius, btnY + btnHeight);
  ctx.quadraticCurveTo(btnX, btnY + btnHeight, btnX, btnY + btnHeight - radius);
  ctx.lineTo(btnX, btnY + radius);
  ctx.quadraticCurveTo(btnX, btnY, btnX + radius, btnY);
  ctx.closePath();
  ctx.fill();

  // Border
  ctx.shadowColor = "transparent";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#a10000"; // darker red border
  ctx.stroke();

  // Button text
  ctx.fillStyle = "white";
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Discard", btnX + btnWidth / 2, btnY + btnHeight / 2);

  ctx.restore();

  // Store button position for click detection
  discardModal.buttonX = btnX;
  discardModal.buttonY = btnY;
}

export function drawDiscardModalCloseButton() {
  const closeBoxSize = modalCloseSize;
  const closeBoxX = modalX + modalWidth - closeBoxSize - 10;
  const closeBoxY = modalY + 10;
  const radius = 6;

  ctx.save();

  // Shadow
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Button background with rounded corners
  ctx.fillStyle = "#e63939"; // nice red
  ctx.beginPath();
  ctx.moveTo(closeBoxX + radius, closeBoxY);
  ctx.lineTo(closeBoxX + closeBoxSize - radius, closeBoxY);
  ctx.quadraticCurveTo(closeBoxX + closeBoxSize, closeBoxY, closeBoxX + closeBoxSize, closeBoxY + radius);
  ctx.lineTo(closeBoxX + closeBoxSize, closeBoxY + closeBoxSize - radius);
  ctx.quadraticCurveTo(closeBoxX + closeBoxSize, closeBoxY + closeBoxSize, closeBoxX + closeBoxSize - radius, closeBoxY + closeBoxSize);
  ctx.lineTo(closeBoxX + radius, closeBoxY + closeBoxSize);
  ctx.quadraticCurveTo(closeBoxX, closeBoxY + closeBoxSize, closeBoxX, closeBoxY + closeBoxSize - radius);
  ctx.lineTo(closeBoxX, closeBoxY + radius);
  ctx.quadraticCurveTo(closeBoxX, closeBoxY, closeBoxX + radius, closeBoxY);
  ctx.closePath();
  ctx.fill();

  // Border
  ctx.shadowColor = "transparent";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#a10000"; // darker red border
  ctx.stroke();

  // White "X" centered
  ctx.fillStyle = "white";
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("X", closeBoxX + closeBoxSize / 2, closeBoxY + closeBoxSize / 2);

  ctx.restore();

  // Store position for click detection
  discardModal.closeX = closeBoxX;
  discardModal.closeY = closeBoxY;
  discardModal.closeSize = closeBoxSize;
}



export function drawDiscardModal() {
  if (!inventoryVariables.inventoryOpen || inventoryVariables.selectedItem === null) return; 

  const itemIndex = inventoryVariables.selectedItem;
  const item = inventoryItems[itemIndex];
  
  // Draw modal background with rounded corners
const radius = 10;

ctx.fillStyle = "#888"; // grey
ctx.strokeStyle = "#444"; // dark border
ctx.lineWidth = 4;

ctx.beginPath();
ctx.moveTo(modalX + radius, modalY);
ctx.lineTo(modalX + modalWidth - radius, modalY);
ctx.quadraticCurveTo(modalX + modalWidth, modalY, modalX + modalWidth, modalY + radius);
ctx.lineTo(modalX + modalWidth, modalY + modalHeight - radius);
ctx.quadraticCurveTo(modalX + modalWidth, modalY + modalHeight, modalX + modalWidth - radius, modalY + modalHeight);
ctx.lineTo(modalX + radius, modalY + modalHeight);
ctx.quadraticCurveTo(modalX, modalY + modalHeight, modalX, modalY + modalHeight - radius);
ctx.lineTo(modalX, modalY + radius);
ctx.quadraticCurveTo(modalX, modalY, modalX + radius, modalY);
ctx.closePath();

ctx.fill();
ctx.stroke();


  // Draw item name at top
  ctx.fillStyle = "white";
  ctx.font = "22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(item.name, canvas.width / 2, modalY + 15);

  drawDrinkButton(item);
  drawDiscardButton();


  // Draw warning message just above the button, inside modal
if (inventoryVariables.warningMessage) {
  ctx.fillStyle = "yellow"; // bright, readable color
  ctx.font = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";

  ctx.shadowColor = "black";
  ctx.shadowBlur = 4;

  // If warning is for drinking, position above drink button
  const warningY = inventoryVariables.warningForDrink 
    ? discardModal.drinkButtonY - 10 
    : discardModal.buttonY - 10;

  ctx.fillText(inventoryVariables.warningMessage, canvas.width / 2, warningY);
  ctx.shadowBlur = 0;

  if (inventoryVariables.warningTimer > 0) inventoryVariables.warningTimer--;
  else inventoryVariables.warningMessage = "";
}
drawDiscardModalCloseButton();
}

console.log(inventoryImg.width, inventoryImg.height);

export function drawInventoryCloseButton() {
  ctx.save();
  // Red button with rounded corners, border, and shadow
const closeBoxX = inventoryUI.x + inventoryUI.width - inventoryUI.closeSize + 50;
const closeBoxY = inventoryUI.y;
const closeBoxSize = inventoryUI.closeSize;
const radius = 6; // small corner radius

// Shadow
ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
ctx.shadowBlur = 6;
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 2;

// Button background
ctx.fillStyle = "#e63939"; // nicer red
ctx.beginPath();
ctx.moveTo(closeBoxX + radius, closeBoxY);
ctx.lineTo(closeBoxX + closeBoxSize - radius, closeBoxY);
ctx.quadraticCurveTo(closeBoxX + closeBoxSize, closeBoxY, closeBoxX + closeBoxSize, closeBoxY + radius);
ctx.lineTo(closeBoxX + closeBoxSize, closeBoxY + closeBoxSize - radius);
ctx.quadraticCurveTo(closeBoxX + closeBoxSize, closeBoxY + closeBoxSize, closeBoxX + closeBoxSize - radius, closeBoxY + closeBoxSize);
ctx.lineTo(closeBoxX + radius, closeBoxY + closeBoxSize);
ctx.quadraticCurveTo(closeBoxX, closeBoxY + closeBoxSize, closeBoxX, closeBoxY + closeBoxSize - radius);
ctx.lineTo(closeBoxX, closeBoxY + radius);
ctx.quadraticCurveTo(closeBoxX, closeBoxY, closeBoxX + radius, closeBoxY);
ctx.closePath();
ctx.fill();

// Border
ctx.shadowColor = "transparent"; // disable shadow for stroke
ctx.lineWidth = 2;
ctx.strokeStyle = "#a10000"; // darker red border
ctx.stroke();

// White "X" centered
ctx.fillStyle = "white";
ctx.font = "bold 24px sans-serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("X", closeBoxX + closeBoxSize / 2, closeBoxY + closeBoxSize / 2);

ctx.restore();

}

export function discardItem(itemIndex) {
  const item = inventoryItems[itemIndex];
  if (!item) return;

  // Count how many swords the player has
  const swordCount = inventoryItems.filter(i => i.name === "Iron Sword").length;

  // Prevent discarding the only sword
  if (item.name === "Iron Sword" && swordCount <= 1) {
    inventoryVariables.warningMessage = "You cannot discard your only sword!";
    inventoryVariables.warningTimer = 180;
    return;
  }

  if (item.type === "rune") {
    inventoryVariables.warningMessage = "You cannot discard a rune!";
    inventoryVariables.warningTimer = 180;
    return;
  }

  // Remove item from array
  inventoryItems.splice(itemIndex, 1);
  console.log(`${item.name} discarded.`);
  
  // Close discard modal
  inventoryVariables.selectedItem = null;
  inventoryVariables.warningMessage = "";
}