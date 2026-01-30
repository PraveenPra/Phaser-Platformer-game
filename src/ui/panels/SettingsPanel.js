/**
 * SettingsPanel
 * -------------
 * Game settings overlay.
 */
import { BasePanel } from "./BasePanel.js";
import { UIPanel } from "../components/UIPanel.js";
import { UIButton } from "../components/UIButton.js";
import { GameState } from "/src/GameState.js";
import { UISwitch } from "../components/UISwitch.js";

export class SettingsPanel extends BasePanel {
  constructor(scene) {
    super(scene);

    // Dark overlay
    const overlay = scene.add
      .rectangle(0, 0, scene.scale.width, scene.scale.height, 0x000000, 0.6)
      .setOrigin(0)
      .setScrollFactor(0);

    this.container.add(overlay);

    // Centered panel
    this.panel = new UIPanel(scene, {
      width: 10,
      height: 8,
      anchor: "center",
    });

    this.container.add(this.panel.container);

    // Title
    const title = scene.add
      .bitmapText(0, 30, "bigFont", "SETTINGS", 34)
      .setOrigin(0.5, 0);

    title.x = this.panel.width / 2;
    this.panel.add(title);

    // Back button
    const backBtn = new UIButton(scene, {
      text: "BACK",
      width: 5,
      height: 2,
      onClick: () => scene.uiState.show("pause"),
    });

    backBtn.container.setPosition(
      ((this.panel.width - backBtn.width) * 5) / 4,
      30,
    );

    this.panel.add(backBtn.container);

    const musicSwitch = new UISwitch(scene, {
      label: "music",
      trueLabel: "ON",
      falseLabel: "OFF",
      value: GameState.audio.musicEnabled,
      width: 10,
      height: 4,
      onToggle: (v) => {
        GameState.audio.musicEnabled = v;
        scene.sound.mute = !v;
      },
    });

    musicSwitch.container.setPosition(100, 100);
    this.panel.add(musicSwitch.container);

    const sfxSwitch = new UISwitch(scene, {
      label: "sfx",
      trueLabel: "ON",
      falseLabel: "OFF",
      value: GameState.audio.sfxEnabled,
      width: 10,
      height: 4,
      onToggle: (v) => {
        GameState.audio.sfxEnabled = v;
      },
    });

    sfxSwitch.container.setPosition(100, 160);
    this.panel.add(sfxSwitch.container);

    this.hide();
  }
}
