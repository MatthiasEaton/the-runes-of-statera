export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
export const canvasWidth = 1000;
export const canvasHeight = 600;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Set player start position
export const groundY = canvasHeight + 80;
export const spriteOffsetY = 90;

export const inventoryUI = {
  x: (canvasWidth - 500) / 2,
  y: (canvasHeight - 500) / 2,
  width: 500,
  height: 500,
  closeSize: 40,
};

export let gravity = 0.4;
export let jumpStrength = 8;
export const speed = 2.5;
export let hasHit = false;