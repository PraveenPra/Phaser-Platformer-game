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

    this.load.image("ground", "assets/ground.png");

    this.load.image("big-fireball", "assets/vfx/big-fireball.png");
  }

  create() {
    this.scene.start("CharacterSelect");
    // GameState.selectedDigimon = "agumon";
    // this.scene.start("Start");
  }
}
