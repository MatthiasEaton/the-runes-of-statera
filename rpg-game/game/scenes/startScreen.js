import { ctx, canvas } from "../core/config.js";
import { gameState } from "../core/game.js";
import { updateDialogue } from "../ui/dialogue.js";
import { startScreen } from "../core/assets.js";

let blinkTimer = 0;
let showText = true;



export function updateStartScene() {
    blinkTimer++;
  
    if (blinkTimer > 30) { // adjust speed here
      showText = !showText;
      blinkTimer = 0;
    }
  }

  export function drawStartScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (startScreen.complete) {
        ctx.drawImage(startScreen, 0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // tweak 0.2–0.5
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    
    // title (optional but nice)
    ctx.save();

ctx.font = "64px Cinzel";
ctx.textAlign = "center";

// softer, tighter shadow (less glow, more depth)
ctx.shadowColor = "rgba(0,0,0,0.6)";
ctx.shadowBlur = 20;
ctx.shadowOffsetY = 3;

// VERY subtle outline for clarity
ctx.lineWidth = 0.7;
ctx.strokeStyle = "rgba(0,0,0,0.5)";
ctx.strokeText("The Runes of Statera", canvas.width / 2, 150);

// your original fill
ctx.fillStyle = "white";
ctx.fillText("The Runes of Statera", canvas.width / 2, 150);


    
  
    // flashing prompt
    if (showText) {
      ctx.fillStyle = "yellow";
      ctx.font = "16px 'Press Start 2P'";
      ctx.fillText("Press Enter to start", canvas.width / 2, 400);
    }
    ctx.restore();
  }

  export function startIntroSequence() {
    if (gameState.fadeActive) return;
  
    gameState.fadeActive = true;
    gameState.fadeDirection = 1; // fade to black
    gameState.fadeTextScene = "introText";
  
    gameState.nextScene = "throneRoom"; // NEW scene
  }

  export function updateIntroScene() {
    updateDialogue();
  
    
  }

