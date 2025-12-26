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

    this.load.image("ground", "assets/ground.png");
  }

  create() {
    this.scene.start("CharacterSelect");
  }
}
