import { createAnimations } from "../systems/AnimationFactory.js";

export class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {}

  create() {
    this.add
      .text(480, 270, "ASSETS LOADED OK", {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    console.log(this.textures.get("agumon").getFrameNames());

    createAnimations(this, "gabumon");

    const sprite = this.add.sprite(480, 270, "gabumon");
    sprite.play("gabumon_idle");
  }

  update() {}
}
