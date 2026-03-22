import { BaseLevelScene } from "/src/scenes/base/BaseLevelScene.js";
import { LevelFlowSystem } from "/src/systems/level/LevelFlowSystem.js";
import { SurvivalConfig } from "/src/scenes/levels/survival/SurvivalConfig.js";
import { SurvivalEnemySystem } from "/src/systems/survival/SurvivalEnemySystem.js";
import { SurvivalHuntAI } from "/src/entities/enemy/ai/survival/SurvivalHuntAI.js";

export class SurvivalScene extends BaseLevelScene {
  constructor() {
    super("SurvivalScene");
  }

  create() {
    super.create();

    // build level
    LevelFlowSystem.create(this, SurvivalConfig);

    // create survival enemy system
    this.survivalEnemies = new SurvivalEnemySystem(this);

    // test spawn
    this.time.delayedCall(2000, () => {
      const cam = this.cameras.main;

      // const spawnX = cam.scrollX + cam.width + 100;

      this.survivalEnemies.spawn("agumon", 400, 200);
    });
  }

  update(time, delta) {
    this.player?.update(delta);

    this.survivalEnemies.update(delta);
    this.parallaxBg?.update();
  }
}
