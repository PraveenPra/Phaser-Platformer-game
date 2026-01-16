const ENEMY_TYPE_MAP = {
  Patrol: {
    texture: "gabumon",
    ai: "patrol",
  },
  Guard: {
    texture: "chivmon",
    ai: "guard",
  },
};

export class EnemySpawnManager {
  constructor(scene, map, enemyGroup) {
    this.scene = scene;
    this.map = map;
    this.enemyGroup = enemyGroup;

    this.spawnDistance = 800; // px from camera center
    this.despawnDistance = 1200;

    this.spawnPoints = [];
    this.activeEnemies = new Map();

    this._loadSpawnPoints();
  }

  _loadSpawnPoints() {
    const layer = this.map.getObjectLayer("EnemiesLayer");

    if (!layer) {
      console.warn("EnemiesLayer not found");
      return;
    }

    layer.objects.forEach((obj) => {
      this.spawnPoints.push({
        id: obj.id,
        x: obj.x,
        y: obj.y - obj.height, // Tiled → Phaser fix
        type: obj.type || "Default",
        spawned: false,
      });
    });

    console.log("Enemy spawn points:", this.spawnPoints.length);
    this.spawnPoints.forEach((p) => {
      console.log("SpawnPoint", p.id, "x:", p.x);
    });
  }

  update() {
    console.log("Spawner update tick");

    const cam = this.scene.cameras.main;
    const camCenterX = cam.scrollX + cam.width / 2;
    console.log("Camera center X:", camCenterX);

    this.spawnPoints.forEach((point) => {
      const dist = Math.abs(point.x - camCenterX);

      // Spawn
      if (!point.spawned && dist < this.spawnDistance) {
        this._spawnEnemy(point);
      }

      // Despawn
      if (point.spawned && dist > this.despawnDistance) {
        this._despawnEnemy(point);
      }
    });
  }

  _spawnEnemy(point) {
    const EnemyClass = this.scene.registry.get("EnemyClass");

    const config = ENEMY_TYPE_MAP[point.type] || ENEMY_TYPE_MAP.Patrol;

    const enemy = new EnemyClass(this.scene, point.x, point.y, config.texture, {
      ai: config.ai,
      spawnType: point.type,
    });

    enemy.spawnId = point.id;

    this.enemyGroup.add(enemy);
    this.activeEnemies.set(point.id, enemy);
    point.spawned = true;

    console.log(
      `Spawned ${config.texture} as ${point.type} at`,
      point.x,
      point.y
    );
  }

  _despawnEnemy(point) {
    const enemy = this.activeEnemies.get(point.id);

    if (!enemy) return;

    enemy.destroy();

    this.activeEnemies.delete(point.id);
    point.spawned = false;

    console.log("Despawned enemy", point.id);
  }
}
