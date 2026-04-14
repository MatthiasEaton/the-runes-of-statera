import { updateForest, drawForest } from "../scenes/forest.js";
import { updateThroneRoom, drawThroneRoom } from "../scenes/throneRoom.js";
import { updateCastle, drawCastle } from "../scenes/castle.js";
import { updateForest2, drawForest2 } from "../scenes/forest2.js";
import { updateForest3, drawForest3 } from "../scenes/forest3.js";
import { player } from "../entities/player.js";
import { priest, king, archer, knightTemplar, castleNPC } from "../entities/npc.js";
import { enemiesByScene } from "../entities/enemies.js";
import { gameState } from "../core/game.js";
import { updateCredits, drawCredits } from "../scenes/credits.js";
import { updateOrcThroneRoom, drawOrcThroneRoom } from "../scenes/orcThroneRoom.js";
import { orcKing } from "../entities/npc.js";
import { updateStartScene, drawStartScene } from "../scenes/startScreen.js";
import { music } from "../core/audio.js";
import { unlocked } from "../core/game.js";
import { setSettingsOpen } from "../ui/settings.js";


export function setScene(scene) {
    gameState.currentScene = scene;

    // 🎧 MUSIC HANDLING (single place)
    const sceneMusic = {
        startScreen: "assets/audio/homescreen.wav",
        forest: "assets/audio/forest.wav",
        throneRoom: "assets/audio/castle.wav",
        forest2: "assets/audio/forest.wav",
        forest3: "assets/audio/forest.wav",
        castle: "assets/audio/castle.wav",
        orcThroneRoom: "assets/audio/orcKing.wav",
        credits: "assets/audio/credits.wav"
    };

    if (sceneMusic[scene] && unlocked) {
        music.play(sceneMusic[scene]);
    }

    // --- Reset player and camera ---
    player.worldX = 100;
    player.x = 100;
    player.direction = "right";
    gameState.cameraX = 0;
    gameState.bgX = 0;

    // --- Reset NPC dialogue per scene ---
    if (scene === "forest") {
        priest.dialogueFinished = false;
        priest.showBubble = true;
    } else if (scene === "throneRoom") {
        king.dialogueFinished = false;
        king.showBubble = true;
        if (gameState.storyProgress === "start") {
            setSettingsOpen(true);
        }
        if (gameState.storyProgress === "postCastleBoss") {
            king.dialogue = king.finalDialogue;   // 👈 after boss
        } else {
            king.dialogue = king.introDialogue;    // 👈 first time
        }
        knightTemplar.forEach(knight => {
            knight.dialogueFinished = false;
            knight.showBubble = true;
        });
    } else if (scene === "forest2") {
        archer.dialogueFinished = false;
        archer.showBubble = true;
    }
    else if (scene === "forest3") {
        // if you have a new NPC here, reset them
        // example:
        // ranger.dialogueFinished = false;
        // ranger.showBubble = true;
    }
    else if (scene === "castle") {
        castleNPC.dialogueFinished = false;
        castleNPC.showBubble = true;
    }
    else if (scene === "orcThroneRoom") {
        orcKing.dialogueFinished = false;
        orcKing.showBubble = true;
    }

    // --- Reset all enemies properly ---
    Object.keys(enemiesByScene).forEach(sceneKey => {
        enemiesByScene[sceneKey].forEach(enemy => {
            // deactivate enemies from other scenes
            if (sceneKey !== scene) {
                enemy.active = false;
                enemy.state = "dead";       // make sure AI/combat ignores them
                enemy.attackHit = false;
                enemy.isAttacking = false;
            } else {
                // activate current scene enemies
                enemy.active = false;
                enemy.state = "idle";
                enemy.health = enemy.maxHealth;
                enemy.frameX = 0;
                enemy.frameTimer = 0;
                enemy.fadeOut = 0;
                enemy.deadComplete = false;
                enemy.attackHit = false;
                enemy.isAttacking = false;
            }
        });
    });
}

export function updateScene() {
    if (gameState.currentScene === "forest") updateForest();
    else if (gameState.currentScene === "throneRoom") updateThroneRoom();
    else if (gameState.currentScene === "forest2") updateForest2();
    else if (gameState.currentScene === "forest3") updateForest3();
    else if (gameState.currentScene === "castle") updateCastle();
    else if (gameState.currentScene === "credits") updateCredits();
    else if (gameState.currentScene === "orcThroneRoom") updateOrcThroneRoom();
    else if (gameState.currentScene === "startScreen") updateStartScene();
}

export function drawScene() {
    if (gameState.currentScene === "forest") drawForest();
    else if (gameState.currentScene === "throneRoom") drawThroneRoom();
    else if (gameState.currentScene === "forest2") drawForest2();
    else if (gameState.currentScene === "forest3") drawForest3();
    else if (gameState.currentScene === "castle") drawCastle();
    else if (gameState.currentScene === "credits") drawCredits();
    else if (gameState.currentScene === "orcThroneRoom") drawOrcThroneRoom();
    else if (gameState.currentScene === "startScreen") drawStartScene();
}