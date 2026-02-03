import { createAnimations } from "../systems/AnimationFactory.js";
import { GameState } from "../GameState.js";
import { Player } from "../entities/Player/Player.js";
import { PlayerInput } from "../entities/Player/PlayerInput.js";
import { MobileControls } from "../entities/Player/MobileControls.js";
import { Enemy } from "../entities/enemy/Enemy.js";
import { PlayerHealthUI } from "../ui/PlayerHealthUI.js";
import { EnemySpawnManager } from "../systems/EnemySpawnManager.js";
import { SceneControls } from "../utils/SceneControls.js";
import { AudioManager } from "../systems/AudioManager.js";
import { NarrativeSystem } from "../systems/NarrativeSystem.js";
import { Tutorials } from "/src/data/narrative/tutorials.js";

export class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {}

  create() {
    // =================================================
    // SCENE CONTROLS
    // =================================================

    this.input.addPointer(2);

    this.controls = new SceneControls(this, {
      keyPause: "ESC",
    });

    if (!this.scene.isActive("UIScene")) {
      this.scene.launch("UIScene");
      this.scene.bringToTop("UIScene");
    }

    this.narrative = new NarrativeSystem(this);

    // 🔥 CLEANUP when scene shuts down or restarts
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.narrative?.destroy();
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

    this.anims.create({
      key: "sx-impact-hit",
      frames: this.anims.generateFrameNumbers("sx-impact-hit", {
        start: 2,
        end: 4,
      }),
      frameRate: 24,
      repeat: 0,
    });

    this.anims.create({
      key: "vfx-fireblast",
      frames: this.anims.generateFrameNumbers("vfx-fireblast", {
        start: 2,
        end: 5, //intentionally keeping it 1 frame short
      }),
      frameRate: 24,
      repeat: 0,
    });

    this.anims.create({
      key: "vfx-explosion",
      frames: this.anims.generateFrameNumbers("vfx-explosion", {
        start: 0,
        end: 5, //intentionally keeping it 1 frame short
      }),
      frameRate: 24,
      repeat: 0,
    });

    this.anims.create({
      key: "vfx-windball",
      frames: this.anims.generateFrameNumbers("vfx-windball", {
        start: 0,
        end: 4,
      }),
      frameRate: 24,
      repeat: -1,
    });

    this.anims.create({
      key: "vfx-leafball",
      frames: this.anims.generateFrameNumbers("vfx-leafball", {
        start: 0,
        end: 2,
      }),
      frameRate: 24,
      repeat: -1,
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

        // hold at peak
        { key: "traps", frame: "Spike-up-4" },
        { key: "traps", frame: "Spike-up-4" },
        { key: "traps", frame: "Spike-up-4" },

        // retract
        { key: "traps", frame: "Spike-up-3" },
        { key: "traps", frame: "Spike-up-2" },
        { key: "traps", frame: "Spike-up-1" },
      ],
      frameRate: 6,
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
    const baseW = 960;
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

      // bg.setAlpha(0.6);

      return bg;
    };

    this.bgSky = createParallax("bg3", -50, 0.05);
    this.bgMountains = createParallax("bg2", -40, 0.04);
    // this.bgForest = createParallax("bg1", -30, 0.02);
    // this.bgTrees = createParallax("bg1", -20, 0.01);

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
    // BACKGROUND MUSIC
    // =================================================
    AudioManager.syncPersistentMusic(this);
    AudioManager.playPersistentMusic(this, "sfx-bg-music-1");

    // =================================================
    // INTRO NARRATION
    // =================================================

    this.createMobileControls();

    // Game start narration
    // INTRO first
    this.events.emit("narrative:trigger", Tutorials.INTRO);

    // MOVE after intro ends
    this.time.delayedCall(4000, () => {
      this.events.emit("narrative:trigger", Tutorials.MOVE);
    });

    this.physics.world.on("worldbounds", (body) => {
      if (!this.player || this.player.isDead) return;

      if (body.gameObject === this.player) {
        // bottom only
        if (body.blocked.down) {
          this.player.takeDamage(9999);
        }
      }
    });
  }

  update(time, delta) {
    this.player.update(delta);
    this.playerHealthUI.draw();
    this.enemySpawner.update();

    const camX = this.cameras.main.scrollX;
    this.bgSky.tilePositionX = camX * this.bgSky.parallaxFactor;
    this.bgMountains.tilePositionX = camX * this.bgMountains.parallaxFactor;
    // this.bgForest.tilePositionX = camX * this.bgForest.parallaxFactor;
    // this.bgTrees.tilePositionX = camX * this.bgTrees.parallaxFactor;

    // inside update()
    if (!this._jumpHintShown && Math.abs(this.player.body.velocity.x) > 5) {
      this._jumpHintShown = true;
      this.events.emit("narrative:trigger", Tutorials.JUMP);
    }
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
    const cam = this.cameras.main;

    this.events.emit("narrative:trigger", Tutorials.GAME_OVER);
    // short pause after death anim
    this.time.delayedCall(800, () => {
      cam.fadeOut(1000, 0, 0, 0);

      cam.once("camerafadeoutcomplete", () => {
        GameState.playerStats.hp = GameState.playerStats.maxHp;
        this.scene.restart();
      });
    });
  }

  onLevelComplete() {
    if (this.levelEnding) return;
    this.levelEnding = true;

    // stop player movement
    // this.player.setVelocity(0, 0);

    // play narration
    this.events.emit("narrative:trigger", Tutorials.END);

    // fade after narration
    this.time.delayedCall(2600, () => {
      const cam = this.cameras.main;

      AudioManager.playSFX(this, "sfx-level-complete");

      cam.fadeOut(1500, 0, 0, 0);

      cam.once("camerafadeoutcomplete", () => {
        // later → go to next level / story scene
        this.scene.restart(); // TEMP
      });
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
    AudioManager.playSFX(this, "sfx-collect-shard");
    // GameState.dataShards = (GameState.dataShards ?? 0) + value;

    GameState.dataShards.add(value);
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

  createMobileControls() {
    const size = 64;
    // example inside your scene's create()
    const leftBtn = this.add
      .sprite(
        50,
        this.cameras.main.height - 50,
        "mobile-buttons",
        "mb-left-button",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(1000)
      .setOrigin(0.5)
      .setDisplaySize(size, size);

    const rightBtn = this.add
      .sprite(
        150,
        this.cameras.main.height - 50,
        "mobile-buttons",
        "mb-right-button",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(1000)
      .setOrigin(0.5)
      .setDisplaySize(size, size);

    const jumpBtn = this.add
      .sprite(
        this.cameras.main.width - 150,
        this.cameras.main.height - 50,
        "mobile-buttons",
        "mb-jump-button",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(1000)
      .setOrigin(0.5)
      .setDisplaySize(size, size);

    const attackBtn = this.add
      .sprite(
        this.cameras.main.width - 50,
        this.cameras.main.height - 50,
        "mobile-buttons",
        "mb-attack-main-button",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(1000)
      .setOrigin(0.5)
      .setDisplaySize(size, size);

    const attackSkill1Btn = this.add
      .sprite(
        this.cameras.main.width - 150,
        this.cameras.main.height - 150,
        "mobile-buttons",
        "mb-attack-skill1",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(1000)
      .setOrigin(0.5)
      .setDisplaySize(size, size);

    const attackSkill2Btn = this.add
      .sprite(
        this.cameras.main.width - 50,
        this.cameras.main.height - 150,
        "mobile-buttons",
        "mb-attack-skill2",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(1000)
      .setOrigin(0.5)
      .setDisplaySize(size, size);

    // ===== Link to virtual state =====
    const linkButton = (btn, key) => {
      btn.on("pointerdown", () => {
        this.player.inputHandler.virtual[key] = true;
        console.log(`Pointer DOWN ${key}`, this.player.inputHandler.virtual);
      });
      btn.on("pointerup", () => {
        this.player.inputHandler.virtual[key] = false;
        console.log(`Pointer UP ${key}`, this.player.inputHandler.virtual);
      });
      btn.on("pointerout", () => {
        this.player.inputHandler.virtual[key] = false;
        console.log(`Pointer OUT ${key}`, this.player.inputHandler.virtual);
      });
    };

    linkButton(leftBtn, "left");
    linkButton(rightBtn, "right");
    linkButton(jumpBtn, "jump");
    linkButton(attackBtn, "attackMain");
    linkButton(attackSkill1Btn, "attackSkill1");
    linkButton(attackSkill2Btn, "attackSkill2");
  }
}
