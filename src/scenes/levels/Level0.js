import { BaseLevelScene } from "../base/BaseLevelScene.js";
import { loadTilemap } from "/src/systems/level/TilemapLoader.js";
import { ObjectLayerSpawner } from "/src/systems/level/ObjectLayerSpawner.js";
import { GameState } from "/src/GameState.js";
import { DataShardSystem } from "/src/systems/level/DataShardSystem.js";
import { TrapSystem } from "/src/systems/level/TrapSystem.js";
import { EnemySystem } from "/src/systems/level/EnemySystem.js";
import { ParallaxBackgroundSystem } from "/src/systems/level/ParallaxBackgroundSystem.js";
import { FOREST_PARALLAX } from "/src/data/level/parallaxPresets.js";

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
    ObjectLayerSpawner.spawnCollectibles(this, this.map);

    // =================================================
    // ENVIRONMENTAL TRAPS — placeholder for next step
    // =================================================
    this.traps = this.physics.add.staticGroup();
    ObjectLayerSpawner.spawnTraps(this, this.map);

    // =================================================
    // INTRO NARRATION
    // =================================================

    // Game start narration
    // INTRO first
    // this.events.emit("narrative:trigger", Tutorials.INTRO);

    // MOVE after intro ends
    // this.time.delayedCall(4000, () => {
    //   this.events.emit("narrative:trigger", Tutorials.MOVE);
    // });

    // =================================================
    // ENEMIES GROUP after tilemap and before player
    // =================================================
    this.enemies = this.physics.add.group();
    EnemySystem.setup(this);

    // =================================================
    // PLAYER (SAME AS START)
    // =================================================
    const key = GameState.selectedDigimon;
    GameState.currentForm = key;

    const { checkpoint } = GameState;
    const x = checkpoint?.x ?? 200;
    const y = checkpoint?.y ?? 350;

    this.player = this.spawnPlayer(x, y, key);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // cleanup on shutdown
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (GameState.player === this.player) {
        GameState.clearPlayer();
      }
    });

    // =================================================
    // MOBILE CONTROLS: HUD
    // =================================================
    this.createMobileControls();

    // After player spawns (needs player reference)
    DataShardSystem.setup(this);
    TrapSystem.setup(this);

    // create zone
    const goalX = this.physics.world.bounds.width - 200;
    const goalY = this.physics.world.bounds.height - 300;
    const goalW = 200;
    const goalH = 300;
    this.levelGoal = this.add.zone(goalX, goalY, goalW, goalH);
    this.physics.add.existing(this.levelGoal, true);

    this.physics.add.overlap(
      this.player,
      this.levelGoal,
      this.onLevelComplete,
      null,
      this,
    );

    // =================================================
    // PARALLAX BACKGROUND
    // =================================================
    this.parallaxBg = new ParallaxBackgroundSystem(this, FOREST_PARALLAX);
  }

  update(time, delta) {
    if (this.player) {
      this.player.update(delta);
    }

    EnemySystem.update(this, delta);

    this.parallaxBg?.update();
  }
}
