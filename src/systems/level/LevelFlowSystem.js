import { loadTilemap } from "./TilemapLoader.js";
import { ObjectLayerSpawner } from "./ObjectLayerSpawner.js";
import { EnemySystem } from "./EnemySystem.js";
import { DataShardSystem } from "./DataShardSystem.js";
import { TrapSystem } from "./TrapSystem.js";
import { ParallaxBackgroundSystem } from "./ParallaxBackgroundSystem.js";
import { ProjectileSystem } from "./ProjectileSystem.js";
import { GameState } from "/src/GameState.js";

export class LevelFlowSystem {
  static create(scene, config) {
    // Fundamental scene properties
    scene.levelConfig = config;

    // ===============================
    // TILEMAP
    // ===============================
    if (config.tilemap) {
      const { map, groundLayer } = loadTilemap(
        scene,
        config.tilemap.mapKey,
        config.tilemap.tileset,
      );

      scene.map = map;
      scene.groundLayer = groundLayer;
    }

    // ===============================
    // PROJECTILES (needs ground)
    // ===============================
    scene.projectileSystem = new ProjectileSystem(scene);

    // ===============================
    // COLLECTIBLES
    // ===============================
    if (config.collectibles) {
      scene.dataShards = scene.physics.add.group({
        allowGravity: false,
        immovable: true,
      });
      ObjectLayerSpawner.spawnCollectibles(scene, scene.map);
    }

    // ===============================
    // TRAPS
    // ===============================
    if (config.traps) {
      scene.traps = scene.physics.add.staticGroup();
      ObjectLayerSpawner.spawnTraps(scene, scene.map);
    }

    // ===============================
    // ENEMIES
    // ===============================
    if (config.enemies) {
      scene.enemies = scene.physics.add.group();
      EnemySystem.setup(scene);
    }

    // =================================================
    // ACTIVE LEVEL REGISTRATION
    // =================================================
    GameState.setActiveScene(scene.scene.key);

    // =================================================
    // PLAYER SPAWN RESOLUTION
    // =================================================
    const checkpoint = GameState.checkpoint;

    const spawn =
      checkpoint && checkpoint.scene === scene.scene.key
        ? { x: checkpoint.x, y: checkpoint.y }
        : config.playerSpawn;

    // Sync GameState so restarts are consistent
    GameState.checkpoint = {
      scene: scene.scene.key,
      x: spawn.x,
      y: spawn.y,
    };

    // =================================================
    // PLAYER
    // =================================================
    const key = GameState.selectedDigimon;
    GameState.currentForm = key;
    const player = scene.spawnPlayer(spawn.x, spawn.y, key);

    // ===============================
    // POST-PLAYER SYSTEMS
    // ===============================
    DataShardSystem.setup(scene);
    TrapSystem.setup(scene);

    // ===============================
    // GOAL
    // ===============================
    if (config.goal) {
      const g = config.goal;

      const goalX = scene.physics.world.bounds.width - g.offsetX;
      const goalY = scene.physics.world.bounds.height - g.offsetY;
      const goalW = g.width;
      const goalH = g.height;

      scene.levelGoal = scene.add.zone(goalX, goalY, goalW, goalH);
      scene.physics.add.existing(scene.levelGoal, true);

      scene.physics.add.overlap(
        scene.player,
        scene.levelGoal,
        scene.onLevelComplete,
        null,
        scene,
      );

      // OPTIONAL dev visual (same as before)
      if (scene.physics.config.debug) {
        scene.goalDebug = scene.add
          .rectangle(goalX, goalY, goalW, goalH)
          .setStrokeStyle(2, 0x00ff00)
          .setDepth(999)
          .setOrigin(0.5);
      }
    }

    // ===============================
    // PARALLAX
    // ===============================
    if (config.parallax) {
      scene.parallaxBg = new ParallaxBackgroundSystem(scene, config.parallax);
    }

    // ===============================
    // MOBILE CONTROLS
    // ===============================
    scene.createMobileControls();
  }
}
