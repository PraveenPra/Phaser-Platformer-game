import { BaseLevelScene } from "../base/BaseLevelScene.js";
import { loadTilemap } from "/src/systems/level/TilemapLoader.js";
import { ObjectLayerSpawner } from "/src/systems/level/ObjectLayerSpawner.js";

export class Level0 extends BaseLevelScene {
  constructor() {
    super("Level0");
  }

  create() {
    super.create(); // REQUIRED - Run the parent's create method first

    // Load tilemap and create layers
    const { map, groundLayer } = loadTilemap(this, "level0-tilemap", {
      name: "TerrainTileset_32x32",
      imageKey: "level0-terrain-tileset",
      groundLayer: "GroundLayer",
    });

    this.map = map;
    this.groundLayer = groundLayer;

    // =================================================
    // DATA SHARDS (COLLECTIBLES)
    // =================================================
    this.dataShards = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    // Spawn collectibles
    ObjectLayerSpawner.spawnCollectibles(this, this.map);

    // =================================================
    // ENVIRONMENTAL TRAPS — placeholder for next step
    // =================================================
    this.traps = this.physics.add.staticGroup();
  }
}
