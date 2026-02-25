import { BaseLevelScene } from "../base/BaseLevelScene.js";
import { LevelFlowSystem } from "/src/systems/level/LevelFlowSystem.js";
import { Level1Config } from "./Level1Config.js";
import { EnemySystem } from "/src/systems/level/EnemySystem.js";

export class Level1 extends BaseLevelScene {
  constructor() {
    super("Level1");
  }

  create() {
    super.create();
    LevelFlowSystem.create(this, Level1Config);
  }

  update(time, delta) {
    this.player?.update(delta);
    EnemySystem.update(this, delta);
    this.parallaxBg?.update();
  }
}
