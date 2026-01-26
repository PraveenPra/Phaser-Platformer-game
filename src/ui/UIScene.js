import { UIFactory } from "./UIFactory.js";
import { UIStateManager } from "./UIStateManager.js";
import { HUDPanel } from "./panels/HUDPanel.js";
import { PausePanel } from "./panels/PausePanel.js";
import { SettingsPanel } from "./panels/SettingsPanel.js";

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UIScene" });
  }

  create() {
    // UI never scrolls
    this.cameras.main.setScroll(0, 0);

    // Root UI container
    this.root = this.add.container(0, 0);
    this.root.setScrollFactor(0);

    // Shared factory
    this.factory = new UIFactory(this);

    // Panel state manager
    this.uiState = new UIStateManager(this);

    // --- Panels ---
    this.hud = new HUDPanel(this);
    this.pausePanel = new PausePanel(this);
    this.settingsPanel = new SettingsPanel(this);

    this.uiState.register("pause", this.pausePanel);
    this.uiState.register("settings", this.settingsPanel);

    // ESC handling (global UI behavior)
    this.input.keyboard.on("keydown-ESC", () => {
      if (this.uiState.isActive()) {
        this.resumeGame();
      } else {
        this.pauseGame();
      }
    });
  }

  pauseGame() {
    this.scene.pause("Start");
    this.uiState.show("pause");
  }

  resumeGame() {
    this.uiState.hide();
    this.scene.resume("Start");
  }
}
