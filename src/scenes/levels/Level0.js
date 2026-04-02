import { BaseLevelScene } from "../base/BaseLevelScene.js";
import { LevelFlowSystem } from "/src/systems/level/LevelFlowSystem.js";
import { Level0Config } from "./Level0Config.js";
import { EnemySystem } from "/src/systems/level/EnemySystem.js";

export class Level0 extends BaseLevelScene {
  constructor() {
    super("Level0");
  }

  create() {
    super.create();
    LevelFlowSystem.create(this, Level0Config);
  }

  update(time, delta) {
    this.player?.update(delta);
    EnemySystem.update(this, delta);
    this.parallaxBg?.update();
  }
}
