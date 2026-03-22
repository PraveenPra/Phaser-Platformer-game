import { Enemy } from "/src/entities/enemy/Enemy.js";
import { SurvivalHuntAI } from "/src/entities/enemy/ai/survival/SurvivalHuntAI.js";

export class SurvivalEnemySystem {
  constructor(scene) {
    this.scene = scene;

    scene.enemies = scene.physics.add.group();

    scene.physics.add.collider(scene.enemies, scene.groundLayer);

    // spawning
    this.spawnTimer = 0;
    this.spawnInterval = 2000; // 2 seconds
    this.maxEnemies = 6;
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

    // spawn slightly before right edge of screen
    const x = cam.scrollX + cam.width - 40;

    // small vertical variation
    const y = 380;

    console.log("SPAWNING ENEMY");

    this.spawn("agumon", x, y, { level: 1, role: "elite" });
  }

  getGroundY(x) {
    const scene = this.scene;

    // scan downward until we find ground
    for (let y = 0; y < scene.scale.height; y += 16) {
      const tile = scene.groundLayer.getTileAtWorldXY(x, y);

      if (tile && tile.collides) {
        return tile.getTop() - 2;
      }
    }

    return scene.scale.height;
  }

  update(dt) {
    // ===== spawn logic =====
    this.spawnTimer += dt;

    const alive = this.scene.enemies.countActive(true);

    if (this.spawnTimer >= this.spawnInterval && alive < this.maxEnemies) {
      this.spawnRandom();
      this.spawnTimer = 0;
    }

    // ===== update enemies =====
    this.scene.enemies.children.each((enemy) => {
      if (!enemy || enemy.isDead) return;

      enemy.update(dt);
    });
  }
}
