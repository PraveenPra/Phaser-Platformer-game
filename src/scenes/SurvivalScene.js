import { BaseLevelScene } from "/src/scenes/base/BaseLevelScene.js";
import { LevelFlowSystem } from "/src/systems/level/LevelFlowSystem.js";
import { SurvivalConfig } from "/src/scenes/levels/survival/SurvivalConfig.js";
import { SurvivalEnemySystem } from "/src/systems/survival/SurvivalEnemySystem.js";

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

    // ======================
    // GAME STATS
    // ======================

    this.score = 0;
    this.wave = 0;

    // ======================
    // UI TEXT
    // ======================

    this.scoreText = this.add
      .text(500, 20, "Score: 0", {
        fontSize: "20px",
        color: "#ffffff",
      })
      .setScrollFactor(0);

    this.waveText = this.add
      .text(500, 50, "Wave: 0", {
        fontSize: "20px",
        color: "#ffffff",
      })
      .setScrollFactor(0);

    this.waveAlert = this.add
      .text(this.cameras.main.width / 2, 80, "", {
        fontSize: "28px",
        color: "#ffff00",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    // ======================
    // EVENTS
    // ======================

    this.events.on("enemyKilled", () => {
      this.score += 100;
      this.scoreText.setText("Score: " + this.score);
    });

    this.events.on("waveStart", () => {
      this.wave++;

      this.waveText.setText("Wave: " + this.wave);

      this.waveAlert.setText("WAVE " + this.wave);

      this.time.delayedCall(1500, () => {
        this.waveAlert.setText("");
      });
    });
  }

  update(time, delta) {
    this.player?.update(delta);

    this.survivalEnemies.update(delta);
    this.parallaxBg?.update();
  }
}
