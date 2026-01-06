import { GameState } from "../GameState.js";

export class Preload extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    this.load.atlas(
      "agumon",
      "assets/digimons/Agumon/Agumon.png",
      "assets/digimons/Agumon/Agumon.json"
    );

    this.load.atlas(
      "gabumon",
      "assets/digimons/Gabumon/Gabumon.png",
      "assets/digimons/Gabumon/Gabumon.json"
    );

    this.load.atlas(
      "chivmon",
      "assets/digimons/Chivmon/Chivmon.png",
      "assets/digimons/Chivmon/Chivmon.json"
    );

    this.load.image("ground", "assets/ground.png");

    this.load.image("big-fireball", "assets/vfx/big-fireball.png");

    this.load.spritesheet("fireball", "assets/vfx/fireball-vfx.png", {
      frameWidth: 17,
      frameHeight: 17,
    });

    // This generates a 1×1 white texture in memory.
    // No asset file needed. Perfect for systems.
    // To be used for attack hitboxes.
    this.textures.generate("__hitbox", {
      data: ["1"],
      pixelWidth: 1,
      pixelHeight: 1,
    });
  }

  create() {
    this.scene.start("CharacterSelect");
    // GameState.selectedDigimon = "agumon";
    // this.scene.start("Start");
  }
}
