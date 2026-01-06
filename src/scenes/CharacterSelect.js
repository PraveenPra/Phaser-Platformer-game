import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";

export class CharacterSelect extends Phaser.Scene {
  constructor() {
    super("CharacterSelect");
  }

  create() {
    createAnimations(this, "agumon");
    createAnimations(this, "gabumon");
    createAnimations(this, "chivmon");

    const agumon = this.add
      .sprite(300, 320, "agumon")
      .play("agumon_idle")
      .setInteractive();

    const gabumon = this.add
      .sprite(660, 320, "gabumon")
      .play("gabumon_idle")
      .setInteractive();

    const chivmon = this.add
      .sprite(460, 320, "chivmon")
      .play("chivmon_idle")
      .setInteractive();

    agumon.on("pointerdown", () => this.select("agumon"));
    gabumon.on("pointerdown", () => this.select("gabumon"));
    chivmon.on("pointerdown", () => this.select("chivmon"));

    this.add
      .text(480, 100, "SELECT DIGIMON", {
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  select(key) {
    GameState.selectedDigimon = key;
    this.scene.start("Start"); // temporary
  }
}
