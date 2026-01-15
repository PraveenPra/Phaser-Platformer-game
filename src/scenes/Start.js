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
