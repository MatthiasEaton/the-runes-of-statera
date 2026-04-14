import { player } from "../entities/player.js";
import { runes } from "../entities/npc.js";
import { rune1, rune2, rune3 } from "../core/assets.js";
import { enemiesByScene } from "../entities/enemies.js";
import { gameState } from "../core/game.js";
import { orcActions, armoredOrcActions } from "../entities/orc.js";
import { skeletonActions, armoredSkeletonActions } from "../entities/skeleton.js";
import { minionActions, bossActions } from "../entities/castleEnemies.js";
import { wereWolfActions, werebearActions } from "../entities/forest3Enemies.js";


const bossRuneMap = {
  armoredOrc: { sprite: rune1, name: "Rune of Aequor" },
  armoredSkeleton: { sprite: rune2, name: "Rune of Umbra" },
  werebear: { sprite: rune3, name: "Rune of Ignis" },
}

export function attackEnemies() {
  const allEnemies = enemiesByScene[gameState.currentScene] || [];

  const actionSets = {
    orc: orcActions,
    armoredOrc: armoredOrcActions,
    skeleton: skeletonActions,
    armoredSkeleton: armoredSkeletonActions,
    castleMinion: minionActions,
    castleBoss: bossActions,
    wereWolf: wereWolfActions,
    werebear: werebearActions,
  };

  allEnemies.forEach(enemy => {
    if (!enemy.active || enemy.state === "dead") return;

    const distance = Math.abs(player.worldX - enemy.worldX);

    if (distance <= 40 && player.isAttacking && !player.attackHit) {
      enemy.health -= player.attackDamage;
      enemy.health = Math.max(0, enemy.health);
      player.attackHit = true;

      const actions = actionSets[enemy.type];

      if (enemy.health <= 0 && enemy.state !== "dead") {
        // Death sequence
        enemy.state = "dead";
        enemy.frameY = actions.death.row;
        enemy.maxFrames = actions.death.frames;
        enemy.frameX = 0;
        enemy.frameTimer = 0;
        enemy.fadeOut = 0;
        enemy.deadComplete = false;

        if (enemy.type === "castleBoss") {
          gameState.nextScene = "throneRoom";
          gameState.storyProgress = "postCastleBoss";

          gameState.fadeTextScene = "kingEncounter";
          gameState.fadeActive = true;
          gameState.fadeDirection = 1;
        }

        // Spawn rune if boss
        if (enemy.boss && !enemy.runeDropped) {
          const bossRune = bossRuneMap[enemy.type];
      
          if (bossRune) {
            runes.push({
              sprite: bossRune.sprite,
              worldX: enemy.worldX + enemy.width / 2 - 32 + 20,
              y: enemy.y + enemy.height - 64 - 15,
              width: 8,
              height: 8,
              collected: false,
              canCollect: false,
              spawnTime: performance.now(),
              name: bossRune.name,
              description: "A glowing rune. Part of the Runes of Statera",
            });
          }
      
          enemy.runeDropped = true;
        }
      }
    }
  });
}