import { Enemy } from "/src/entities/enemy/Enemy.js";
import { SurvivalHuntAI } from "/src/entities/enemy/ai/survival/SurvivalHuntAI.js";

export class SurvivalEnemySystem {
  constructor(scene) {
    this.scene = scene;

    scene.enemies = scene.physics.add.group();
    scene.physics.add.collider(scene.enemies, scene.groundLayer);

    // spawn timers
    this.spawnTimer = 0;
    this.spawnDelayTimer = 0;

    this.waveSpawning = false;
    this.spawnedInWave = 0;

    this.waveState = "waiting";
    this.breakTimer = 0;

    this.maxEnemies = 6;
    this.enemyPool = ["agumon", "gabumon", "patamon", "wormmon"];

    this.gameTime = 0;
    this.difficultyLevel = 1;

    // prepare first wave
    this.prepareNextWave();
  }

  prepareNextWave() {
    // time before wave begins
    this.spawnInterval = Phaser.Math.Between(2000, 3500);

    // enemies per wave
    this.waveSize = Phaser.Math.Clamp(3 + this.difficultyLevel, 3, 12);

    // spawn speed
    this.spawnDelay = Phaser.Math.Clamp(
      500 - this.difficultyLevel * 20,
      150,
      500,
    );
  }

  spawn(charName, x, y, config = {}) {
    const enemy = new Enemy(this.scene, x, y, charName, {
      level: config.level ?? this.difficultyLevel,
      role: config.role ?? "elite",
    });

    enemy.speedMultiplier = Phaser.Math.Clamp(
      0.25 + this.difficultyLevel * 0.05,
      0.25,
      0.6,
    );

    enemy.ai = new SurvivalHuntAI();

    this.scene.enemies.add(enemy);

    return enemy;
  }

  spawnRandom() {
    const cam = this.scene.cameras.main;

    // spawn near right edge
    const x = cam.scrollX + cam.width - 40;

    // small Y variation
    const y = Phaser.Math.Between(360, 400);

    console.log("SPAWNING ENEMY");
    const charName = Phaser.Utils.Array.GetRandom(this.enemyPool);

    this.spawn(charName, x, y, { level: 1, role: "elite" });
    // this.spawn("agumon", x, y, { level: 1, role: "elite" });
  }

  getGroundY(x) {
    const scene = this.scene;

    for (let y = 0; y < scene.scale.height; y += 16) {
      const tile = scene.groundLayer.getTileAtWorldXY(x, y);

      if (tile && tile.collides) {
        return tile.getTop() - 2;
      }
    }

    return scene.scale.height;
  }

  update(dt) {
    const alive = this.scene.enemies.countActive(true);

    // =====================
    // WAITING FOR WAVE
    // =====================
    if (this.waveState === "waiting") {
      this.spawnTimer += dt;

      if (this.spawnTimer >= this.spawnInterval) {
        this.waveState = "spawning";
        this.spawnedInWave = 0;
        this.spawnDelayTimer = 0;

        this.scene.events.emit("waveStart", {
          size: this.waveSize,
        });
      }
    }

    // =====================
    // SPAWNING WAVE
    // =====================
    else if (this.waveState === "spawning") {
      this.spawnDelayTimer += dt;

      if (this.spawnDelayTimer >= this.spawnDelay) {
        this.spawnRandom();

        this.spawnDelayTimer = 0;
        this.spawnedInWave++;

        if (this.spawnedInWave >= this.waveSize) {
          // spawning finished
          this.waveState = "combat";
        }
      }
    }

    // =====================
    // COMBAT PHASE
    // =====================
    else if (this.waveState === "combat") {
      if (alive === 0) {
        this.waveState = "break";
        this.breakTimer = 0;

        this.scene.events.emit("waveCleared");
      }
    }

    // =====================
    // BREAK BETWEEN WAVES
    // =====================
    else if (this.waveState === "break") {
      this.breakTimer += dt;

      if (this.breakTimer >= 2500) {
        this.difficultyLevel++;

        this.prepareNextWave();

        this.waveState = "waiting";
        this.spawnTimer = 0;
      }
    }

    // =====================
    // UPDATE ENEMIES
    // =====================
    this.scene.enemies.children.each((enemy) => {
      if (!enemy || enemy.isDead) return;

      enemy.update(dt);
    });
  }
}
