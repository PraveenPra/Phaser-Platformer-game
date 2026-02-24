import { EnemySpawnManager } from "/src/systems/EnemySpawnManager.js";
import { Enemy } from "/src/entities/enemy/Enemy.js";

export const EnemySystem = {
  setup(scene) {
    if (!scene.map || !scene.groundLayer) {
      console.warn("EnemySystem: map or groundLayer missing");
      return;
    }

    // =================================================
    // ENEMIES GROUP
    // =================================================
    scene.enemies = scene.physics.add.group();

    // Allow spawner to know what class to spawn
    scene.registry.set("EnemyClass", Enemy);

    // Enemies ↔ ground
    scene.physics.add.collider(scene.enemies, scene.groundLayer);

    // =================================================
    // SPAWN MANAGER
    // =================================================
    scene.enemySpawner = new EnemySpawnManager(scene, scene.map, scene.enemies);
  },

  update(scene, delta) {
    if (!scene.enemySpawner) return;

    scene.enemySpawner.update();

    scene.enemies.children.each((enemy) => {
      if (!enemy || enemy.isDead) return;
      enemy.update(delta);
    });
  },

  cleanup(scene) {
    scene.enemySpawner?.destroy?.();
    scene.enemySpawner = null;
    scene.enemies?.clear?.(true, true);
    scene.enemies = null;
  },
};
