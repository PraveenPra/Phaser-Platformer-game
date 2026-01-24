import { createAnimations } from "../systems/AnimationFactory.js";
import { GameState } from "../GameState.js";
import { Player } from "../entities/Player/Player.js";
import { Enemy } from "../entities/enemy/Enemy.js";
import { PlayerHealthUI } from "../ui/PlayerHealthUI.js";
import { EnemySpawnManager } from "../systems/EnemySpawnManager.js";
import { SceneControls } from "../utils/SceneControls.js";

export class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {}

  create() {
    // =================================================
    // SCENE CONTROLS
    // =================================================
    this.controls = new SceneControls(this, {
      keyPause: "ESC",
    });

    // =================================================
    // TILEMAP + WORLD (MUST COME FIRST)
    // =================================================
    const map = this.make.tilemap({
      key: "level1-map",
      tileWidth: 32,
      tileHeight: 32,
    });

    const tileset = map.addTilesetImage("Tileset1", "level1-tileset");
    map.addTilesetImage("Tileset2", "level1-tileset-enemies"); // placeholder

    this.groundLayer = map.createLayer("GroundLayer", tileset, 0, 0);
    this.groundLayer.setCollisionByProperty({ collides: true });

    // World bounds = tilemap size
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Camera bounds
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // =================================================
    // SHARED ANIMATIONS (GLOBAL)
    // =================================================
    this.anims.create({
      key: "fireball_fly",
      frames: this.anims.generateFrameNumbers("fireball", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "impact-hit",
      frames: this.anims.generateFrameNumbers("impact-hit", {
        start: 0,
        end: 5,
      }),
      frameRate: 18,
      repeat: 0,
    });

    // =================================================
    // ENEMIES GROUP (BEFORE PLAYER)
    // =================================================
    this.enemies = this.physics.add.group({
      runChildUpdate: true,
    });

    // Register enemy class for spawner
    this.registry.set("EnemyClass", Enemy);

    // Enemies ↔ ground
    this.physics.add.collider(this.enemies, this.groundLayer);

    // Enemy spawn manager
    this.enemySpawner = new EnemySpawnManager(this, map, this.enemies);

    // =================================================
    // PLAYER (AFTER WORLD + GROUPS)
    // =================================================
    const key = GameState.selectedDigimon;
    const { checkpoint } = GameState;
    const playerSpawnX = checkpoint?.x ?? 200;
    const playerSpawnY = checkpoint?.y ?? 350;

    this.player = this.spawnPlayer(playerSpawnX, playerSpawnY, key);

    this.events.once("player-dead", () => {
      this.restartFromCheckpoint();
    });

    // =================================================
    // PARALLAX BACKGROUNDS
    // =================================================
    const cam = this.cameras.main;
    const baseW = 320;
    const scale = Math.ceil(cam.width / baseW);
    this.bgScale = scale;

    const createParallax = (key, depth, factor) => {
      const img = this.textures.get(key).getSourceImage();
      const bg = this.add.tileSprite(
        0,
        cam.height - img.height * scale,
        cam.width,
        img.height * scale,
        key,
      );

      bg.setOrigin(0, 0).setScrollFactor(0).setScale(scale).setDepth(depth);

      bg.parallaxFactor = factor;
      return bg;
    };

    this.bgSky = createParallax("bg4", -50, 0.05);
    this.bgMountains = createParallax("bg3", -40, 0.04);
    this.bgForest = createParallax("bg2", -30, 0.02);
    this.bgTrees = createParallax("bg1", -20, 0.01);
  }

  update(time, delta) {
    this.player.update(delta);
    this.playerHealthUI.draw();
    this.enemySpawner.update();

    const camX = this.cameras.main.scrollX;
    this.bgSky.tilePositionX = camX * this.bgSky.parallaxFactor;
    this.bgMountains.tilePositionX = camX * this.bgMountains.parallaxFactor;
    this.bgForest.tilePositionX = camX * this.bgForest.parallaxFactor;
    this.bgTrees.tilePositionX = camX * this.bgTrees.parallaxFactor;
  }

  // =================================================
  // PLAYER SPAWNER (USED BY EVOLUTION / SWITCH)
  // =================================================
  spawnPlayer(x, y, key) {
    // ensure animations exist for this form
    createAnimations(this, key);

    const player = new Player(this, x, y, key);
    player.body.setCollideWorldBounds(true);

    // Player ↔ ground
    this.physics.add.collider(player, this.groundLayer);

    // Player ↔ enemies
    this.physics.add.collider(player, this.enemies);

    // Camera follow
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    // UI
    this.playerHealthUI?.destroy();
    this.playerHealthUI = new PlayerHealthUI(this, player);

    this.player = player;
    return player;
  }

  restartFromCheckpoint() {
    // Full clean restart
    this.scene.restart();
  }
}
