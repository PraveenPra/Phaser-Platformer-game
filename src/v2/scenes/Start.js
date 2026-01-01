import { createAnimations } from "../systems/AnimationFactory.js";
import { GameState } from "../GameState.js";
import { Player } from "../entities/Player/Player.js";
import { Enemy } from "../entities/enemy/Enemy.js";

export class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {}

  create() {
    const key = GameState.selectedDigimon;
    createAnimations(this, key);

    this.player = new Player(this, 200, 400, key);

    this.ground = this.add.tileSprite(400, 500, 800, 12, "ground");
    this.physics.add.existing(this.ground, true);

    this.physics.add.collider(this.player, this.ground);

    this.enemy = new Enemy(this, 500, 400, "gabumon");
    this.physics.add.collider(this.enemy, this.ground);
  }

  update(time, delta) {
    this.player.update(delta);
    this.enemy.update(delta);
  }
}
