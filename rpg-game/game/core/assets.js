export const background = new Image();
background.src = "./assets/images/forestBackground.png";

export const startScreen = new Image();
startScreen.src = "./assets/images/StartMenu.png";

export const throneBackground = new Image();
throneBackground.src = "./assets/images/throneBackground.png";


export const castleBackground = new Image();
castleBackground.src = "./assets/images/castleBackground.png";


export const forestBackground2 = new Image();
forestBackground2.src = "./assets/images/forestBackground2.png";

export const forestBackground3 = new Image();
forestBackground3.src = "./assets/images/forestBackground3.png";

export const orcThroneRoom = new Image();
orcThroneRoom.src = "./assets/images/OrcThroneRoom.png";

export const knightSprite = new Image();
knightSprite.src = "./assets/images/Swordsman.png";


export const worldTiles = new Image();
worldTiles.src = "./assets/images/world_tileset.png";

export const bagIcon = new Image();
bagIcon.src = "./assets/images/bag-icon.png";

export const gearIcon = new Image();
gearIcon.src = "./assets/images/settings-gear.png";

export const inventoryImg = new Image();
inventoryImg.src = "./assets/images/inventory.png";

export const swordImg = new Image();
swordImg.src = "./assets/images/sword.png";

export const healingPotionImg = new Image();
healingPotionImg.src = "./assets/images/healing-potion.png";

export const priestSprite = new Image();
priestSprite.src = "./assets/images/Priest.png";

export const speechBubble = {
  sprite: new Image(),
  width: 40,  // adjust to your sprite size
  height: 40,
};

speechBubble.sprite.src = "./assets/images/speech-bubble.png";

export const orcSprite = new Image();
orcSprite.src = "./assets/images/Orc.png";

export const armoredOrcSprite = new Image();
armoredOrcSprite.src = "./assets/images/Armored-Orc.png";

export const skeletonSprite = new Image();
skeletonSprite.src = "./assets/images/Skeleton.png";

export const armoredSkeletonSprite = new Image();
armoredSkeletonSprite.src = "./assets/images/Armored-Skeleton.png";

export const knight2Sprite = new Image();
knight2Sprite.src = "./assets/images/Knight.png";

export const armoredAxemanSprite = new Image();
armoredAxemanSprite.src = "./assets/images/Armored-Axeman.png";

export const wereWolfSprite = new Image();
wereWolfSprite.src = "./assets/images/WereWolf.png";

export const greatswordSkeletonSprite = new Image();
greatswordSkeletonSprite.src = "./assets/images/Greatsword-Skeleton.png";

export const werebearSprite = new Image();
werebearSprite.src = "./assets/images/Werebear.png";

export const orcRiderSprite = new Image();
orcRiderSprite.src = "./assets/images/Orc-Rider.png";

export const lancerSprite = new Image();
lancerSprite.src = "./assets/images/Lancer.png";

export const kingSprite = new Image();
kingSprite.src = "./assets/images/King.png";

export const knightTemplarSprite = new Image();
knightTemplarSprite.src = "./assets/images/KnightTemplar.png";

export const orcKingSprite = new Image();
orcKingSprite.src = "./assets/images/Orc-King.png";

export const archerSprite = new Image();
archerSprite.src = "./assets/images/Archer.png";

export const wizardSprite = new Image();
wizardSprite.src = "./assets/images/Wizard.png";

export const wizardEffectSprite = new Image();
wizardEffectSprite.src = "./assets/images/wizard-effect.png";

export const rune1 = new Image();
rune1.src = "./assets/images/rune-1.png";

export const rune2 = new Image();
rune2.src = "./assets/images/rune-2.png";

export const rune3 = new Image();
rune3.src = "./assets/images/rune-3.png";

export const rune4 = new Image();
rune4.src = "./assets/images/rune-4.png";

// Optional: preload checker
export function preloadAssets(callback) {
  const images = [
    background, throneBackground, forestBackground2, armoredOrcSprite, castleBackground,
    knightSprite, orcSprite, worldTiles, priestSprite, speechBubble.sprite,
    swordImg, inventoryImg, bagIcon, healingPotionImg, kingSprite,
    knightTemplarSprite, rune1, skeletonSprite, armoredSkeletonSprite,
    rune2, rune3, rune4, wizardSprite, wizardEffectSprite, forestBackground3,
    wereWolfSprite, greatswordSkeletonSprite, werebearSprite, orcRiderSprite,
    armoredAxemanSprite, knight2Sprite, lancerSprite, orcThroneRoom,
    orcKingSprite, startScreen, gearIcon
  ];

  let loaded = 0;

  images.forEach(img => {
    // Use addEventListener to avoid overwriting other onload handlers
    img.addEventListener("load", () => {
      loaded++;
      if (loaded === images.length) {
        console.log("All images loaded!");
        callback(); // start the game after all images loaded
      }
    });
  });
}