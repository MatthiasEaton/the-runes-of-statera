import { orcs, armoredOrcs } from "./orc.js";
import { skeletons, armoredSkeletons } from "./skeleton.js";
import { minions, boss } from "./castleEnemies.js";
import { wereWolfs, werebears } from "./forest3Enemies.js";


export const enemiesByScene = {
  forest: [...orcs, ...armoredOrcs],
  throneRoom: [],
  forest2: [...skeletons, ...armoredSkeletons],
  castle: [...minions, boss],
  forest3: [...wereWolfs, ...werebears],
};

export function resetCurrentSceneEnemies(sceneName) {
  const enemies = enemiesByScene[sceneName];

  if (!enemies) return;

  enemies.forEach(enemy => {
    enemy.worldX = enemy.startX;
    enemy.health = enemy.maxHealth;

    enemy.state = "idle";
    enemy.frameX = 0;

    // use per-enemy actions
    const actions = enemy.actions;

    enemy.frameY = actions.idle.row;
    enemy.maxFrames = actions.idle.frames;

    enemy.active = false;
    enemy.attacking = false;
    enemy.attackHit = false;

    enemy.fadeOut = 0;
    enemy.deadComplete = false;

    if (enemy.dialogueFinished !== undefined) {
      enemy.dialogueFinished = false;
      enemy.showBubble = true;
    }

    enemy.xpGiven = false;
    enemy.runeDropped = false;
  });
}