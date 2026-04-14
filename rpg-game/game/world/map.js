import { canvas, ctx, groundY, spriteOffsetY} from "../core/config.js";
import { worldTiles } from "../core/assets.js";
import { gameState } from "../core/game.js";


export let tree = {
  worldX: 0,
  width: 15,
  height: 47,
  scale: 4,
  sourceX: 0,
  sourceY: 48,
};



tree.screenY = groundY - tree.height * tree.scale - spriteOffsetY;

export function drawTree() {
  const screenX = tree.worldX - gameState.cameraX;
  
  // Only draw if it’s on screen
  if (screenX + tree.width * tree.scale > 0 && screenX < canvas.width) {
    ctx.drawImage(
      worldTiles,
      tree.sourceX, tree.sourceY, tree.width, tree.height,
      screenX + 138, tree.screenY - 38,
      tree.width * tree.scale, tree.height * tree.scale
    );
  }
}