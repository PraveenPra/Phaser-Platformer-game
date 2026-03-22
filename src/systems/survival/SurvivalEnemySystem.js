import { Enemy } from "/src/entities/enemy/Enemy.js";

export class SurvivalEnemySystem {
  constructor(scene) {
    this.scene = scene;

    // same structure as EnemySystem
    scene.enemies = scene.physics.add.group();

    // IMPORTANT: same collider normal levels use
    scene.physics.add.collider(scene.enemies, scene.groundLayer);
  }

  spawn(charName, x, y, config = {}) {
    const enemy = new Enemy(this.scene, x, y, charName, {
      ai: config.ai ?? "idle",
      level: config.level ?? 1,
      role: config.role ?? "grunt",
    });

    this.scene.enemies.add(enemy);

    return enemy;
  }

  update(delta) {
    this.scene.enemies.children.each((enemy) => {
      if (!enemy || enemy.isDead) return;

      enemy.update(delta);
    });
  }
}
