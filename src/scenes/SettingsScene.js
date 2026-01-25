import { GameState } from "/src/GameState.js";

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super("Settings");
  }

  create() {
    const cam = this.cameras.main;

    const text = this.add
      .text(cam.centerX, cam.centerY, this.getText(), {
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    this.input.keyboard.on("keydown-M", () => {
      GameState.audio.musicEnabled = !GameState.audio.musicEnabled;

      if (!GameState.audio.musicEnabled) {
        this.sound.stopAll();
      }

      text.setText(this.getText());
    });

    this.input.keyboard.on("keydown-S", () => {
      GameState.audio.sfxEnabled = !GameState.audio.sfxEnabled;
      text.setText(this.getText());
    });

    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.stop();
      this.scene.resume("Start");
    });
  }

  getText() {
    return (
      `SETTINGS\n\n` +
      `M: Music ${GameState.audio.musicEnabled ? "ON" : "OFF"}\n` +
      `S: SFX ${GameState.audio.sfxEnabled ? "ON" : "OFF"}\n\n` +
      `ESC: Back`
    );
  }
}
