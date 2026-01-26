/**
 * HUDPanel
 * --------
 * Always-visible gameplay HUD.
 */
import { BasePanel } from "./BasePanel.js";
import { UIButton } from "../components/UIButton.js";
import { UIElement } from "../core/UIElement.js";
import { PlayerHealthUI } from "../PlayerHealthUI.js";
import { GameState } from "/src/GameState.js";

export class HUDPanel extends BasePanel {
  constructor(scene) {
    super(scene);

    // Player health (legacy component, top-left)
    this.healthUI = new PlayerHealthUI(scene, scene.scene.get("Start")?.player);

    // Pause button (icon only)
    this.pauseBtn = new UIButton(scene, {
      //   iconOnly: true,
      text: "P",
      width: 2,
      height: 2,
      anchor: "top-right",
      margin: { top: 16, right: 16 },
      onClick: () => scene.pauseGame(),
    });

    this.container.add(this.pauseBtn.container);

    // Currency text (top-right, offset)
    this.currency = new UIElement(scene, {
      anchor: "top-right",
      margin: { top: 16, right: 64 },
    });

    const text = scene.add
      .bitmapText(0, 0, "bigFont", GameState.playerStats.hp, 48)
      .setOrigin(1, 0);

    this.currency.add(text);
    this.currency.setSize(text.width, text.height);

    this.container.add(this.currency.container);

    // React to currency changes
    scene.events.on("currency-changed", (value) => {
      text.setText(value);
      this.currency.setSize(text.width, text.height);
    });

    this.show();
  }
}
