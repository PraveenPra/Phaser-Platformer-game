import { createAnimations } from "../systems/AnimationFactory.js";
import { GameState } from "../GameState.js";
import { Player } from "../entities/Player.js";

export class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {}

  create() {
    const key = GameState.selectedDigimon;

    createAnimations(this, key);

    this.player = new Player(this, 200, 300, key);

    const ground = this.physics.add
      .staticImage(480, 520, null)
      .setDisplaySize(960, 40)
      .refreshBody();

    this.physics.add.collider(this.player, ground);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.player.update(this.cursors);
  }
}
