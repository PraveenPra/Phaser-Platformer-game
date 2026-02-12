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

  _getObjectProperties(obj) {
    const props = {};
    if (!obj.properties) return props;

    obj.properties.forEach((p) => {
      props[p.name] = p.value;
    });

    return props;
  }

  _getTileProperties(gid) {
    if (!gid) return {};

    for (const tileset of this.map.tilesets) {
      const localId = gid - tileset.firstgid;
      if (localId < 0) continue;

      const tileProps = tileset.getTileProperties(localId);
      if (!tileProps) continue;

      return tileProps; // already { key: value }
    }

    return {};
  }

  _loadSpawnPoints() {
    const layer = this.map.getObjectLayer("EnemiesLayer");

    if (!layer) {
      console.warn("EnemiesLayer not found");
      return;
    }

    layer.objects.forEach((obj) => {
      const tileProps = this._getTileProperties(obj.gid);
      const objectProps = this._getObjectProperties(obj);

      // 🔑 object overrides tile
      const finalProps = {
        ...tileProps,
        ...objectProps,
      };

      this.spawnPoints.push({
        id: obj.id,
        x: obj.x,
        y: obj.y - obj.height,

        charName: finalProps.charName ?? obj.type ?? "agumon",
        ai: finalProps.ai ?? "idle",
        level: finalProps.level ?? 1,
        role: finalProps.role ?? "grunt",

        spawned: false,
      });
    });
  }

  update() {
    const cam = this.scene.cameras.main;
    const camCenterX = cam.scrollX + cam.width / 2;

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

    const enemy = new EnemyClass(
      this.scene,
      point.x,
      point.y,
      point.charName || "agumon",
      {
        ai: point.ai,
        level: point.level,
        role: point.role,
      },
    );

    enemy.spawnId = point.id;

    this.enemyGroup.add(enemy);
    this.activeEnemies.set(point.id, enemy);
    point.spawned = true;
  }

  _despawnEnemy(point) {
    const enemy = this.activeEnemies.get(point.id);

    if (!enemy) return;

    enemy.destroy();

    this.activeEnemies.delete(point.id);
    point.spawned = false;
  }
}
