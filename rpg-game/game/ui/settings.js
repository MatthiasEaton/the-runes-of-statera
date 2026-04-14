
import { ctx } from "../core/config.js";
import { canvas } from "../core/config.js";

export let settingsOpen = false;

export let soundMuted = false;

export function setSettingsOpen(value) {
  settingsOpen = value;
}

export function toggleMute() {
  soundMuted = !soundMuted;
}

export function toggleSettings() {
    settingsOpen = !settingsOpen;
  }

export const settingsUI = {
    width: 600,
    height: 450,
    x: canvas.width / 2 - 300,
    y: canvas.height / 2 - 225,
    closeSize: 40,

    soundY: 130,
    controlsY: 270,
    toggleWidth: 120,
    toggleHeight: 40,

    soundBox: {
        x: 40,
        y: 100,
        w: 420,
        h: 90
      },
      
      controlsBox: {
        x: 40,
        y: 270,
        w: 420,
        h: 120
      }
  };

  function drawPanel(x, y, w, h, title) {
    ctx.save();
  
    // panel background
    ctx.fillStyle = "#1f1f1f";
    ctx.fillRect(x, y, w, h);
  
    // header bar
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(x, y, w, 36);
  
    // title
    ctx.fillStyle = "white";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(title, x + 16, y + 18);
  
    // border
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  
    ctx.restore();
  }

export function drawSettings() {
    if (!settingsOpen) return;
  
    ctx.save();
  
    // --- Overlay ---
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // --- Background panel ---
    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(settingsUI.x, settingsUI.y, settingsUI.width, settingsUI.height);
  
    // --- Border ---
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 4;
    ctx.strokeRect(settingsUI.x, settingsUI.y, settingsUI.width, settingsUI.height);
  
    // --- Title ---
    ctx.fillStyle = "white";
    ctx.font = "32px Cinzel";
    ctx.textAlign = "center";
    ctx.fillText("Settings", canvas.width / 2, settingsUI.y + 50);

    const panelX = settingsUI.x;
const panelY = settingsUI.y;

const innerX = panelX + 40;
let y = panelY + 90;

const boxW = settingsUI.width - 80;
const soundBoxH = 100;
const controlsBoxH = 170;

const gap = 30;

    // --- SOUND BOX ---
ctx.fillStyle = "#1f1f1f";
ctx.fillRect(innerX, y, boxW, soundBoxH);

ctx.strokeStyle = "#444";
ctx.strokeRect(innerX, y, boxW, soundBoxH);

const centerY = y + soundBoxH / 2;

// title
ctx.fillStyle = "white";
ctx.font = "bold 20px Cinzel";
ctx.textAlign = "left";
ctx.textBaseline = "middle";

ctx.fillText("Music", innerX + 20, centerY);

// button
const btnW = 120;
const btnH = 36;

const btnX = innerX + boxW - btnW - 16;
const btnY = y + soundBoxH / 2 - btnH / 2;

ctx.fillStyle = soundMuted ? "#e74c3c" : "#2ecc71";
ctx.fillRect(btnX, btnY, btnW, btnH);

ctx.fillStyle = "white";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText(soundMuted ? "MUTED" : "ON", btnX + btnW / 2, btnY + btnH / 2);

// store click
settingsUI.muteBtn = { x: btnX, y: btnY, w: btnW, h: btnH };

y += soundBoxH + gap;


// --- CONTROLS BOX ---
const cx = innerX;
const cy = y;

ctx.fillStyle = "#1f1f1f";
ctx.fillRect(cx, cy, boxW, controlsBoxH);

ctx.strokeStyle = "#444";
ctx.strokeRect(cx, cy, boxW, controlsBoxH);

// title
ctx.fillStyle = "white";
ctx.font = "bold 20px Cinzel";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("Controls", cx + boxW / 2, cy + 22);

// helper
const centerX = cx + boxW / 2;
let textY = cy + 65;

// text style
ctx.font = "18px Cinzel";
ctx.fillStyle = "#ddd";
ctx.textBaseline = "middle";
ctx.textAlign = "center";

// --- Movement ---
ctx.fillText("⬅️   ➡️   Move Left / Right", centerX, textY);
textY += 32;

// --- KEYCAP helper ---
function drawKeycap(label, x, y) {
    const paddingX = 10;
    const fontSize = 14;
  
    ctx.save();
  
    ctx.font = `bold ${fontSize}px sans-serif`;
  
    const textW = ctx.measureText(label).width;
    const w = textW + paddingX * 2;
    const h = 26;
    const radius = 5;
  
    // perfect vertical centering baseline fix
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  
    // box
    ctx.fillStyle = "#2a2a2a";
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 2;
  
    const left = x - w / 2;
    const top = y - h / 2;
  
    ctx.beginPath();
    ctx.moveTo(left + radius, top);
    ctx.lineTo(left + w - radius, top);
    ctx.quadraticCurveTo(left + w, top, left + w, top + radius);
    ctx.lineTo(left + w, top + h - radius);
    ctx.quadraticCurveTo(left + w, top + h, left + w - radius, top + h);
    ctx.lineTo(left + radius, top + h);
    ctx.quadraticCurveTo(left, top + h, left, top + h - radius);
    ctx.lineTo(left, top + radius);
    ctx.quadraticCurveTo(left, top, left + radius, top);
    ctx.closePath();
  
    ctx.fill();
    ctx.stroke();
  
    // text (true center now)
    ctx.fillStyle = "white";
    ctx.fillText(label, x, y + 0.5); // tiny optical correction
  
    ctx.restore();
  }

function drawKeyRow(key, label, y) {
    const keyW = ctx.measureText(key).width + 20;
    const gap = 12;
  
    ctx.font = "bold 14px Cinzel";
  
    // measure label
    ctx.font = "18px Cinzel";
    const labelW = ctx.measureText(label).width;
  
    const totalW = keyW + gap + labelW;
  
    const startX = centerX - totalW / 2;
  
    // draw keycap
    drawKeycap(key, startX + keyW / 2, y);
  
    // draw label
    ctx.fillStyle = "#ddd";
    ctx.font = "18px Cinzel";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(label, startX + keyW + gap, y);
  }

  drawKeyRow("SPACE", "Jump", textY);
  textY += 32;
  
  drawKeyRow("X", "Attack", textY);
  
    // --- Close button ---
    drawSettingsCloseButton();
  
    ctx.restore();
}

export function drawSettingsCloseButton() {
    ctx.save();
  
    const closeBoxSize = settingsUI.closeSize;
    const closeBoxX = settingsUI.x + settingsUI.width - closeBoxSize + 50;
    const closeBoxY = settingsUI.y;
    const radius = 6;
  
    // Shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  
    // Button background
    ctx.fillStyle = "#e63939";
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
    ctx.strokeStyle = "#a10000";
    ctx.stroke();
  
    // X text
    ctx.fillStyle = "white";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("X", closeBoxX + closeBoxSize / 2, closeBoxY + closeBoxSize / 2);
  
    ctx.restore();
  
    // 👇 Store for click detection
    settingsUI.closeX = closeBoxX;
    settingsUI.closeY = closeBoxY;
  }