import { createAnimations } from "../systems/AnimationFactory.js";
import { GameState } from "../GameState.js";
import { Player } from "../entities/Player/Player.js";
import { Enemy } from "../entities/enemy/Enemy.js";
import { PlayerHealthUI } from "../ui/PlayerHealthUI.js";

export class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {}

  create() {
    const key = GameState.selectedDigimon;
    createAnimations(this, key);

    this.anims.create({
      key: "fireball_fly",
      frames: this.anims.generateFrameNumbers("fireball", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });

    this.player = new Player(this, 200, 350, key);
    this.player.body.setCollideWorldBounds(true);

    this.enemies = this.physics.add.group();

    const enemy = new Enemy(this, 650, 350, "gabumon");
    this.enemies.add(enemy);

    this.playerHealthUI = new PlayerHealthUI(this, this.player);

    // // =====================
    // // TILEMAP GROUND
    // // =====================
    this.physics.add.collider(this.player, this.enemies);

    // =================================================
    const map = this.make.tilemap({
      key: "level1-map",
      tileWidth: 32,
      tileHeight: 32,
    });
    const tileset = map.addTilesetImage("Tileset1", "level1-tileset");
    this.groundLayer = map.createLayer("GroundLayer", tileset, 0, 0);

    // World bounds = full tilemap size
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.groundLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, this.groundLayer);
    this.physics.add.collider(this.enemies, this.groundLayer);

    // Camera follow player
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    // this.cameras.main.setZoom(1.2);

    // =====================
    // PARALLAX BACKGROUNDS
    // =====================
    const cam = this.cameras.main;
    const baseW = 320;
    const baseH = 180;

    // integer scale only (important for pixel art)
    const scale = Math.ceil(cam.width / baseW);

    this.bgScale = scale;

    function createParallax(scene, key, depth, factor) {
      const cam = scene.cameras.main;
      const img = scene.textures.get(key).getSourceImage();

      const bg = scene.add.tileSprite(
        0,
        cam.height - img.height * scene.bgScale,
        cam.width,
        img.height * scene.bgScale,
        key
      );

      bg.setOrigin(0, 0)
        .setScrollFactor(0)
        .setScale(scene.bgScale)
        .setDepth(depth);

      bg.parallaxFactor = factor;
      return bg;
    }

    this.bgSky = createParallax(this, "bg4", -50, 0.05);
    this.bgMountains = createParallax(this, "bg3", -40, 0.04);
    this.bgForest = createParallax(this, "bg2", -30, 0.02);
    this.bgTrees = createParallax(this, "bg1", -20, 0.01);

    // function createBg(scene, key, depth) {
    //   const { width, height } = scene.scale;
    //   const img = scene.textures.get(key).getSourceImage();

    //   const bg = scene.add
    //     .tileSprite(0, map.heightInPixels - img.height, width, img.height, key)
    //     .setOrigin(0, 0)
    //     .setScrollFactor(0)
    //     .setDepth(depth);

    //   return bg;
    // }

    // this.bg4 = createBg(this, "bg4", -40).setScale(1700, 1200);
    // this.bg3 = createBg(this, "bg3", -30);
    // this.bg2 = createBg(this, "bg2", -20);
    // this.bg1 = createBg(this, "bg1", -10);

    // this.scale.on("resize", (gameSize) => {
    //   const { width, height } = gameSize;

    //   this.bg4.setSize(width, height);
    //   this.bg3.setSize(width, height);
    //   this.bg2.setSize(width, height);
    //   this.bg1.setSize(width, height);
    // });
  }

  update(time, delta) {
    this.player.update(delta);
    this.playerHealthUI.draw();

    this.enemies.children.iterate((enemy) => {
      if (enemy && enemy.update) {
        enemy.update(delta);
      }
    });

    const camX = this.cameras.main.scrollX;

    this.bgSky.tilePositionX = camX * this.bgSky.parallaxFactor;
    this.bgMountains.tilePositionX = camX * this.bgMountains.parallaxFactor;
    this.bgForest.tilePositionX = camX * this.bgForest.parallaxFactor;
    this.bgTrees.tilePositionX = camX * this.bgTrees.parallaxFactor;
  }
}
