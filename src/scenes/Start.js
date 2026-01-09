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

    // this.ground = this.add.tileSprite(400, 500, 1600, 12, "ground");
    // this.physics.add.existing(this.ground, true);

    // this.physics.add.collider(this.player, this.ground);

    this.enemies = this.physics.add.group();

    const enemy = new Enemy(this, 650, 350, "gabumon");
    this.enemies.add(enemy);

    // this.physics.add.collider(enemy, this.ground);

    this.playerHealthUI = new PlayerHealthUI(this, this.player);

    // =====================
    // TILEMAP GROUND
    // =====================
    const map = this.make.tilemap({
      tileWidth: 32,
      tileHeight: 32,
      width: 50,
      height: 20,
    });

    const tileset = map.addTilesetImage("groundTile", "groundTile", 32, 32);

    // create a blank layer
    this.groundLayer = map.createBlankLayer("ground", tileset);
    // move ground up so it’s visible
    // this.groundLayer.setY(540 - map.tileHeight * 2);

    // fill bottom row with ground tiles
    for (let x = 0; x < map.width; x++) {
      this.groundLayer.putTileAt(0, x, 16);
    }

    // enable collision
    this.groundLayer.setCollisionByExclusion([-1]);

    // physics
    this.physics.add.collider(this.player, this.groundLayer);
    this.physics.add.collider(this.enemies, this.groundLayer);
    this.physics.add.collider(this.player, this.enemies);

    // Camera follow player
    // this.cameras.main.setBounds(0, 0, 800, 600);
    // this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    // this.cameras.main.setZoom(1.5);
  }

  update(time, delta) {
    this.player.update(delta);
    this.playerHealthUI.draw();

    this.enemies.children.iterate((enemy) => {
      if (enemy && enemy.update) {
        enemy.update(delta);
      }
    });
  }
}
