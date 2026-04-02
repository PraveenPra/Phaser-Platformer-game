import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";

export class CharacterSelect extends Phaser.Scene {
  constructor() {
    super("CharacterSelect");
  }

  create() {
    const characters = [
      "botomon",
      "wormmon",
      "kunemon",
      "seraphimon",
      "agumon",
      "chivmon",
      "gabumon",
      "magnamon",
      "patamon",
      "birdramon",
      "imperialdramon",
      "ancienttroiamon",
      "ophanimon",
    ];

    const sprites = [];

    characters.forEach((key) => {
      createAnimations(this, key);
      const sprite = this.add
        .sprite(0, 0, key)
        // .play(`${key}_idle` ?? `${key}_fly`)
        .setInteractive();

      const idleKey = `${key}_idle`;
      const flyKey = `${key}_fly`;

      const animKey = this.anims.exists(idleKey) ? idleKey : flyKey;

      sprite.anims.play(animKey, true);
      sprite.on("pointerdown", () => this.select(key));
      sprites.push(sprite);
    });

    Phaser.Actions.GridAlign(sprites, {
      width: 10,
      cellWidth: 64,
      cellHeight: 100,
      x: this.cameras.main.centerX - 270,
      y: 150,
    });

    this.add
      .text(480, 100, "SELECT DIGIMON", {
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  select(key) {
    GameState.selectedDigimon = key;

    // this.scene.start("DevCalibrationScene"); // temporary
    // this.scene.start("Start");
    // this.scene.start("Level0");
    this.scene.start("SurvivalScene");
  }
}
