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
    this.map = this.make.tilemap({
      key: "level1-map",
      tileWidth: 32,
      tileHeight: 32,
    });

    // map.addTilesetImage("EnemiesTileset2", "level1-tileset-enemies"); // placeholder

    const tileset = this.map.addTilesetImage("Terrain", "level1-tileset");
    this.groundLayer = this.map.createLayer("GroundLayer", tileset, 0, 0);
    this.groundLayer.setCollisionByProperty({ collides: true });

    // World bounds = tilemap size
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels,
    );

    // Camera bounds
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels,
    );

    // =================================================
    // LEVEL GOAL  - Reach to complete level
    // =================================================

    const goalX = this.physics.world.bounds.width - 200;
    const goalY = this.physics.world.bounds.height - 300;
    const goalW = 200;
    const goalH = 300;

    // create zone
    this.levelGoal = this.add.zone(goalX, goalY, goalW, goalH);

    // add static physics body
    this.physics.add.existing(this.levelGoal, true);

    // DEV VISUAL (rectangle outline) - remove later
    this.goalDebug = this.add
      .rectangle(goalX, goalY, goalW, goalH)
      .setStrokeStyle(2, 0x00ff00)
      .setDepth(999);

    // keep debug rect aligned - remove later
    this.goalDebug.setOrigin(0.5);

    // =================================================
    // DATA SHARDS (COLLECTIBLES)
    // =================================================
    this.dataShards = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    // =================================================
    // ENVIRONMENTAL TRAPS
    // =================================================
    this.traps = this.physics.add.staticGroup();

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
    // COLLECTIBLE + TRAP ANIMATIONS
    // =================================================

    // Data Shard rotate
    this.anims.create({
      key: "data-shard-spin",
      frames: [
        { key: "collectables", frame: "data-shard-rotate-1" },
        { key: "collectables", frame: "data-shard-rotate-2" },
        { key: "collectables", frame: "data-shard-rotate-3" },
        { key: "collectables", frame: "data-shard-rotate-4" },
      ],
      frameRate: 8,
      repeat: -1,
    });

    // Spike (up)
    this.anims.create({
      key: "spike-up-anim",
      frames: [
        { key: "traps", frame: "Spike-up-1" },
        { key: "traps", frame: "Spike-up-2" },
        { key: "traps", frame: "Spike-up-3" },
        { key: "traps", frame: "Spike-up-4" },
      ],
      frameRate: 10,
      repeat: -1,
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
    this.enemySpawner = new EnemySpawnManager(this, this.map, this.enemies);

    // =================================================
    // PLAYER (AFTER WORLD + GROUPS)
    // =================================================
    const key = GameState.selectedDigimon;
    GameState.currentForm = key;

    const { checkpoint } = GameState;
    const playerSpawnX = checkpoint?.x ?? 200;
    const playerSpawnY = checkpoint?.y ?? 350;

    this.player = this.spawnPlayer(playerSpawnX, playerSpawnY, key);

    this.events.once("player-dead", () => {
      this.restartFromCheckpoint();
    });

    this.physics.add.overlap(
      this.player,
      this.levelGoal,
      this.onLevelComplete,
      null,
      this,
    );

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

    // =================================================
    // DATA SHARDS - spawn some for demo
    // =================================================

    this.spawnDataShards();

    this.physics.add.overlap(
      this.player,
      this.dataShards,
      this.collectDataShard,
      null,
      this,
    );

    // =================================================
    // ENVIRONMENTAL TRAPS - spawn some for demo
    // =================================================

    this.spawnTrap();

    this.physics.add.overlap(
      this.player,
      this.traps,
      this.onTrapHit,
      null,
      this,
    );

    // =================================================
    // INTRO NARRATION
    // =================================================
    this.showIntroNarration();
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
    GameState.playerStats.hp = GameState.playerStats.maxHp;
    this.scene.restart();
  }

  showIntroNarration() {
    // lock player input temporarily
    this.player.inputLocked = true;

    const cam = this.cameras.main;

    const overlay = this.add
      .rectangle(0, 0, cam.width, cam.height, 0x000000, 0.6)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(100);

    const text = this.add
      .text(
        cam.centerX,
        cam.centerY,
        "The Digital World evolves endlessly...\n\nBut something new is watching.",
        {
          fontSize: "20px",
          color: "#ffffff",
          align: "center",
          wordWrap: { width: cam.width * 0.8 },
        },
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(101)
      .setAlpha(0);

    this.tweens.add({
      targets: text,
      alpha: 1,
      duration: 800,
    });

    const closeNarration = () => {
      overlay.destroy();
      text.destroy();
      this.player.inputLocked = false;
    };

    // auto close after few seconds
    this.time.delayedCall(5000, closeNarration);

    // allow skip
    this.input.keyboard.once("keydown-SPACE", closeNarration);
  }

  onLevelComplete() {
    if (this.levelEnding) return;
    this.levelEnding = true;

    this.player.inputLocked = true;

    const cam = this.cameras.main;

    const text = this.add
      .text(
        cam.centerX,
        cam.centerY,
        "Signal detected...\n\nData analysis in progress.",
        {
          fontSize: "20px",
          color: "#ffffff",
          align: "center",
        },
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(200);

    cam.fadeOut(1500, 0, 0, 0);

    cam.once("camerafadeoutcomplete", () => {
      // later: transition to next scene / story scene
      this.scene.restart(); // TEMP placeholder
    });
  }

  spawnDataShards() {
    const layer = this.map.getObjectLayer("CollectiblesLayer");
    if (!layer) return;

    this.dataShards.clear(true, true);

    layer.objects.forEach((obj) => {
      const x = obj.x + obj.width / 2;
      const y = obj.y - obj.height / 2;

      const shard = this.dataShards.create(x, y, "collectables");
      shard.play("data-shard-spin");

      shard.setData("value", 1);

      // floating animation
      this.tweens.add({
        targets: shard,
        y: y - 6,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    });
  }

  collectDataShard(player, shard) {
    const value = shard.getData("value") || 1;
    shard.destroy();

    GameState.dataShards = (GameState.dataShards ?? 0) + value;

    console.log("Data Shards:", GameState.dataShards);
  }

  spawnTrap() {
    const layer = this.map.getObjectLayer("TrapsLayer");
    if (!layer) return;

    this.traps.clear(true, true);

    layer.objects.forEach((obj) => {
      const x = obj.x + obj.width / 2;
      const y = obj.y - obj.height / 2;

      const spike = this.traps.create(x, y, "traps");
      spike.play("spike-up-anim");

      spike.setData(
        "damage",
        obj.properties?.find((p) => p.name === "damage")?.value ?? 1,
      );
      spike.setData(
        "knockback",
        obj.properties?.find((p) => p.name === "knockback")?.value ?? true,
      );

      // match 64x16 spike art
      spike.body.setSize(60, 12);
      spike.body.setOffset(2, 2);
    });
  }

  onTrapHit(player, trap) {
    if (player.isInvulnerable) return;

    player.takeDamage(trap.getData("damage") || 1, trap);

    player.isInvulnerable = true;

    this.time.delayedCall(800, () => {
      player.isInvulnerable = false;
    });
  }
}
