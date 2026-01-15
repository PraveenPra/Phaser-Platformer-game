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
    this.load.image("bg1", "assets/background_layer1.png");
    this.load.image("bg2", "assets/background_layer2.png");
    this.load.image("bg3", "assets/background_layer3.png");
    this.load.image("bg4", "assets/background_layer4.png");

    this.load.image("big-fireball", "assets/vfx/big-fireball.png");

    this.load.spritesheet("fireball", "assets/vfx/fireball-vfx.png", {
      frameWidth: 17,
      frameHeight: 17,
    });

    this.load.image("groundTile", "assets/ground-tile.png");

    this.load.image("level1-tileset", "assets/tilemaps/tileset_32x32.png");
    this.load.tilemapTiledJSON("level1-map", "assets/tilemaps/level1.json");
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
