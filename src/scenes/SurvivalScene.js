import { BaseLevelScene } from "/src/scenes/base/BaseLevelScene.js";
import { LevelFlowSystem } from "/src/systems/level/LevelFlowSystem.js";
import { SurvivalConfig } from "/src/scenes/levels/survival/SurvivalConfig.js";
import { SurvivalEnemySystem } from "/src/systems/survival/SurvivalEnemySystem.js";
import { GameState } from "/src/GameState.js";

export class SurvivalScene extends BaseLevelScene {
  constructor() {
    super("SurvivalScene");
  }

  create() {
    super.create();

    GameState.gameMode = "survival";

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
    // GAME OVER
    // ======================
    this.events.on("survivalGameOver", (data) => {
      this.physics.pause();

      this.add
        .text(480, 200, "GAME OVER", {
          fontSize: "48px",
          color: "#ff4444",
        })
        .setOrigin(0.5);

      this.add
        .text(480, 260, "Wave Reached: " + data.wave, {
          fontSize: "28px",
          color: "#ffffff",
        })
        .setOrigin(0.5);

      this.add
        .text(480, 310, "Score: " + data.score, {
          fontSize: "28px",
          color: "#ffffff",
        })
        .setOrigin(0.5);

      this.add
        .text(480, 360, "R = Restart", {
          fontSize: "20px",
          color: "#aaaaaa",
        })
        .setOrigin(0.5);

      this.add
        .text(480, 390, "M = Main Menu", {
          fontSize: "20px",
          color: "#aaaaaa",
        })
        .setOrigin(0.5);

      // restart
      this.input.keyboard.once("keydown-R", () => {
        this.scene.restart();
      });

      // main menu
      this.input.keyboard.once("keydown-M", () => {
        this.scene.start("MainMenuScene");
      });
    });

    this.events.on("survivalComplete", (data) => {
      this.physics.pause();

      const reward = data.score * 2 + 200;

      GameState.coins += reward;

      this.add
        .text(480, 200, "SURVIVAL COMPLETE!", {
          fontSize: "42px",
          color: "#ffff00",
        })
        .setOrigin(0.5);

      this.add
        .text(480, 260, "Reward: " + reward + " bits", {
          fontSize: "28px",
          color: "#ffffff",
        })
        .setOrigin(0.5);

      this.add
        .text(480, 320, "R = Play Again", {
          fontSize: "20px",
          color: "#aaaaaa",
        })
        .setOrigin(0.5);

      this.add
        .text(480, 350, "M = Main Menu", {
          fontSize: "20px",
          color: "#aaaaaa",
        })
        .setOrigin(0.5);

      // restart survival
      this.input.keyboard.once("keydown-R", () => {
        this.scene.restart();
      });

      // back to menu
      this.input.keyboard.once("keydown-M", () => {
        this.scene.start("MainMenuScene");
      });
    });

    // ======================
    // UI SCORE & WAVE TEXT
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

    this.events.on("waveStart", (data) => {
      this.wave = data.wave;

      this.waveText.setText("Wave: " + this.wave);

      this.waveAlert.setText("WAVE " + this.wave);

      this.time.delayedCall(1500, () => {
        this.waveAlert.setText("");
      });
    });

    this.events.on("waveCleared", () => {
      this.waveAlert.setText("WAVE CLEARED");

      this.time.delayedCall(1200, () => {
        this.waveAlert.setText("");
      });
    });

    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.start("MainMenuScene");
    });
  }

  update(time, delta) {
    this.player?.update(delta);

    this.survivalEnemies.update(delta);
    this.parallaxBg?.update();
  }
}
