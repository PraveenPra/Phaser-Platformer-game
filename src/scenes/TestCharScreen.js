import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";
const BASE_WIDTH = 320;
const BASE_HEIGHT = 180;

export class CharacterSelect extends Phaser.Scene {
  constructor() {
    super("CharacterSelect");
  }

  create() {
    // 🔒 lock landscape
    if (this.scale.lockOrientation) {
      this.scale.lockOrientation("landscape");
    }

    // 🎯 control world size explicitly
    // this.cameras.main.setZoom(0.9);
    this.fitCameraToScreen();

    // optional clamp
    this.cameras.main.roundPixels = true;

    const characters = [
      "seraphimon",
      "agumon",
      "chivmon",
      "gabumon",
      "magnamon",
      "patamon",
      "birdramon",
    ];

    const sprites = [];

    characters.forEach((key) => {
      createAnimations(this, key);
      const sprite = this.add
        .sprite(0, 0, key)
        // .play(`${key}_idle` ?? `${key}_fly`)
        .setInteractive();
      console.log(sprite.width, sprite.height);
      // 🔑 normalize size
      const TARGET_HEIGHT = 48;
      sprite.setScale(TARGET_HEIGHT / sprite.height);

      const idleKey = `${key}_idle`;
      const flyKey = `${key}_fly`;

      const animKey = this.anims.exists(idleKey) ? idleKey : flyKey;

      sprite.anims.play(animKey, true);
      sprite.on("pointerdown", () => this.select(key));
      sprites.push(sprite);
    });

    Phaser.Actions.GridAlign(sprites, {
      width: 4,
      cellWidth: 70,
      cellHeight: 70,
      x: 30,
      y: 60,
    });

    this.add
      .text(BASE_WIDTH / 2, 20, "SELECT DIGIMON", {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  select(key) {
    GameState.selectedDigimon = key;
    this.scene.start("Start"); // temporary
  }

  fitCameraToScreen() {
    const BASE_WIDTH = 320;
    const BASE_HEIGHT = 180;
    const cam = this.cameras.main;

    const scaleX = this.scale.width / BASE_WIDTH;
    const scaleY = this.scale.height / BASE_HEIGHT;

    const zoom = Math.min(scaleX, scaleY);

    cam.setZoom(zoom);
    cam.centerOn(BASE_WIDTH / 2, BASE_HEIGHT / 2);
    cam.roundPixels = true;
  }
}
