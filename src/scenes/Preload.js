export class Preload extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    this.load.atlas(
      "agumon",
      "assets/digimons/Agumon/Gabumon.png",
      "assets/digimons/Agumon/Gabumon.json"
    );

    this.load.atlas(
      "gabumon",
      "assets/digimons/Gabumon/Gabumon.png",
      "assets/digimons/Gabumon/Gabumon.json"
    );
  }

  create() {
    this.scene.start("Start");
  }
}
