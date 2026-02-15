import { ForestEnemySpawnConfig } from "/src/data/enemySpawns/EnemyZonePacks.js";

export class EnemySpawnManager {
  constructor(scene, map, enemyGroup) {
    this.scene = scene;
    this.map = map;
    this.enemyGroup = enemyGroup;

    this.zones = [];

    this.spawnDistance = 800; // px from camera center
    this.despawnDistance = 1200;

    this.spawnPoints = [];
    this.activeEnemies = new Map();

    this._loadSpawnPoints();

    this._loadZones();

    this.zoneDebug = this.scene.add.graphics().setDepth(9999);
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

  _loadZones() {
    const layer = this.map.getObjectLayer("EnemyZonesLayer");
    if (!layer) return;

    layer.objects.forEach((obj) => {
      this.zones.push({
        id: obj.id,
        name: obj.name,
        rect: new Phaser.Geom.Rectangle(obj.x, obj.y, obj.width, obj.height),
        initialized: false, // 🔑 only once
      });
    });
  }

  _findGroundY(x, startY) {
    const layer = this.scene.groundLayer;
    if (!layer) return null;

    const tilemap = layer.tilemap;
    const tileHeight = tilemap.tileHeight;

    for (let y = startY; y < startY + tileHeight * 8; y += tileHeight) {
      const tile = layer.getTileAtWorldXY(x, y);
      if (tile && tile.collides) {
        return tile.pixelY; // TOP of ground tile
      }
    }

    return null;
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

    this._drawZonesDebug();

    const camRect = new Phaser.Geom.Rectangle(
      cam.scrollX,
      cam.scrollY,
      cam.width,
      cam.height,
    );

    this.zones.forEach((zone) => {
      const inside = Phaser.Geom.Intersects.RectangleToRectangle(
        camRect,
        zone.rect,
      );

      zone.active = inside;
    });

    this.zones.forEach((zone) => {
      if (!zone.initialized) {
        this._spawnZone(zone);
        zone.initialized = true;
      }
    });
  }

  _pickWeightedGroup(groups) {
    const total = groups.reduce((s, g) => s + g.weight, 0);
    let roll = Math.random() * total;

    for (const g of groups) {
      roll -= g.weight;
      if (roll <= 0) return g;
    }
  }
  _spawnZone(zone) {
    const config = ForestEnemySpawnConfig[zone.name];
    if (!config) return;

    const zoneLeft = zone.rect.x;
    const zoneRight = zone.rect.x + zone.rect.width;
    const zoneTop = zone.rect.y;

    config.forEach((group) => {
      const count = Phaser.Math.Between(group.count.min, group.count.max);

      for (let i = 0; i < count; i++) {
        const charName = Phaser.Utils.Array.GetRandom(group.digimons);

        const x = Phaser.Math.Between(zoneLeft, zoneRight);
        const y = zoneTop; // 🔑 EXACTLY like tiled placement

        this.spawnPoints.push({
          id: `zone-${zone.id}-${group.role}-${i}-${Date.now()}`,
          x,
          y,

          charName,
          ai: group.ai ?? "idle",
          level: group.level ?? 1,
          role: group.role ?? "grunt",

          spawned: false,
        });
      }
    });

    zone.spawned = true;
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

  _drawZonesDebug() {
    this.zoneDebug.clear();

    this.zones.forEach((z) => {
      this.zoneDebug.lineStyle(1, z.active ? 0x00ff00 : 0xff0000, 0.35);
      this.zoneDebug.strokeRectShape(z.rect);
    });

    this.spawnPoints.forEach((p) => {
      if (String(p.id).startsWith("zone-")) {
        this.zoneDebug.fillStyle(0x00ffff, 1);
        this.zoneDebug.fillCircle(p.x, p.y, 3);
      }
    });
  }
}
