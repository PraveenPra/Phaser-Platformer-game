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
    createAnimations(this, "patamon");
    createAnimations(this, "seraphimon");

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

    const patamon = this.add
      .sprite(860, 320, "patamon")
      .play("patamon_idle")
      .setInteractive();

    const seraphimon = this.add
      .sprite(120, 320, "seraphimon")
      .play("seraphimon_idle")
      .setInteractive();

    agumon.on("pointerdown", () => this.select("agumon"));
    gabumon.on("pointerdown", () => this.select("gabumon"));
    chivmon.on("pointerdown", () => this.select("chivmon"));
    patamon.on("pointerdown", () => this.select("patamon"));
    seraphimon.on("pointerdown", () => this.select("seraphimon"));

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
