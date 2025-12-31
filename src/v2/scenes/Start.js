import { createAnimations } from "../systems/AnimationFactory.js";
import { GameState } from "../GameState.js";
import { Player } from "../entities/Player/Player.js";

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
  }

  update(time, delta) {
    this.player.update(delta);
  }
}
