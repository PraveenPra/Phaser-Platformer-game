/**
 * PausePanel
 * ----------
 * Pause menu UI.
 *
 * Uses:
 * - UIPanel (anchored center)
 * - UIButton (anchored via panel-local layout)
 *
 * No absolute screen positioning.
 */
import { UIPanel } from "../components/UIPanel.js";
import { UIButton } from "../components/UIButton.js";
import { getUIScale } from "../UIScale.js";

export class PausePanel {
  constructor(scene) {
    this.scene = scene;

    const ui = getUIScale(this.scene);

    // Root container (panel-level visibility control)
    this.container = scene.add.container(0, 0).setScrollFactor(0);

    // Dark overlay
    this.overlay = scene.add
      .rectangle(0, 0, scene.scale.width, scene.scale.height, 0x000000, 0.6)
      .setOrigin(0)
      .setScrollFactor(0);

    this.container.add(this.overlay);

    // Centered panel
    this.panel = new UIPanel(scene, {
      width: 8,
      height: 7,
      anchor: "center",
    });

    this.container.add(this.panel.container);

    // Title
    const title = scene.add
      .bitmapText(0, 28, "bigFont", "PAUSED", 34)
      .setOrigin(0.5, 0);
    title.setScale(ui.font);

    title.x = this.panel.width / 2;
    this.panel.add(title);

    // Buttons (vertical layout for now)
    this.createButton("RESUME", 50, () => scene.resumeGame(), 5, 40);
    this.createButton("settings", 130, () => scene.uiState.show("settings"));
    this.createButton("quit", 170, () => {
      scene.scene.stop("Start");
      scene.scene.start("CharacterSelect");
    });

    this.hide();
  }

  createButton(label, y, onClick, h = 2, fs = 48) {
    const btn = new UIButton(this.scene, {
      text: label,
      width: 10,
      height: h,
      anchor: "top-left", // ignored inside panel
      onClick,
      fontSize: fs,
    });

    btn.container.setPosition((this.panel.width - btn.width) / 2, y);

    this.panel.add(btn.container);
  }

  show() {
    this.container.setVisible(true);
  }

  hide() {
    this.container.setVisible(false);
  }
}
