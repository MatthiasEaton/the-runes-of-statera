import { Game, gameState, restartGame, updateGame } from "./core/game.js";
import { attackEnemies } from "./core/combat.js";
import { updateOrcs } from "./entities/orc.js";
import { collectRunes, player, updatePlayer } from "./entities/player.js";
import { preloadAssets } from "./core/assets.js";
import { drawSharedGameplayUI, handleLevelUpScreen } from "./ui/gameplayUI.js"; // UI overlay
import { updatePriest, updateNPCs } from "./entities/npc.js";
import { checkNPCProximity } from "./ui/dialogue.js";
import { updateDialogue } from "./ui/dialogue.js";
import { updateScene, drawScene } from "./core/sceneManager.js";
import { drawFade } from "./core/game.js";
import { updateCursor } from "./core/input.js";


// Preload assets, then start the game
preloadAssets(() => {
  const game = new Game();
  game.start();

  // Start the main game loop
  function gameloop() {
  if (handleLevelUpScreen()) {
    requestAnimationFrame(gameloop);
    return; // freeze gameplay
  }

  // 1️⃣ Update

  updateGame();

  // 🚫 stop gameplay updates if game over
if (!gameState.gameOver) {
  updatePlayer(gameState);
  updateOrcs();
  collectRunes();
  updatePriest();
  updateNPCs();
  checkNPCProximity();
  attackEnemies(player);
  updateDialogue();
  updateScene();
  updateCursor();
}

  // 2️⃣ Draw
  drawScene();             // draws the current scene
  if (gameState.currentScene !== "credits" && gameState.currentScene !== "startScreen") {
    drawSharedGameplayUI();  // only in gameplay scenes
  }  // player, HUD, inventory, dialogue
  drawFade();              // overlay for fade transitions

  requestAnimationFrame(gameloop);
}

gameloop();

});
