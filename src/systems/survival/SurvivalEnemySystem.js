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

    this.maxEnemies = 6;
    this.enemyPool = ["agumon", "gabumon", "patamon", "wormmon"];

    // prepare first wave
    this.prepareNextWave();
  }

  prepareNextWave() {
    // random time before next wave
    this.spawnInterval = Phaser.Math.Between(1800, 4200);

    // random enemies per wave
    this.waveSize = Phaser.Math.Between(1, 4);

    // random delay between enemies in same wave
    this.spawnDelay = Phaser.Math.Between(200, 450);
  }

  spawn(charName, x, y, config = {}) {
    const enemy = new Enemy(this.scene, x, y, charName, {
      level: config.level ?? 1,
      role: config.role ?? "elite",
    });

    enemy.speedMultiplier = 0.35;
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

    // ===== START WAVE =====
    this.spawnTimer += dt;

    if (
      !this.waveSpawning &&
      this.spawnTimer >= this.spawnInterval &&
      alive < this.maxEnemies
    ) {
      this.waveSpawning = true;
      this.spawnedInWave = 0;
      this.spawnDelayTimer = 0;
      this.spawnTimer = 0;
    }

    // ===== SPAWN WAVE ENEMIES =====
    if (this.waveSpawning) {
      this.spawnDelayTimer += dt;

      if (this.spawnDelayTimer >= this.spawnDelay) {
        if (alive < this.maxEnemies) {
          this.spawnRandom();
        }

        this.spawnDelayTimer = 0;
        this.spawnedInWave++;

        // randomize next spawn delay for organic feel
        this.spawnDelay = Phaser.Math.Between(200, 450);

        if (this.spawnedInWave >= this.waveSize) {
          this.waveSpawning = false;

          // prepare new random wave
          this.prepareNextWave();
        }
      }
    }

    // ===== UPDATE ENEMIES =====
    this.scene.enemies.children.each((enemy) => {
      if (!enemy || enemy.isDead) return;

      enemy.update(dt);
    });
  }
}
