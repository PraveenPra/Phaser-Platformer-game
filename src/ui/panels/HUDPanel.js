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
import { UIText } from "../components/UIText.js";

export class HUDPanel extends BasePanel {
  constructor(scene) {
    super(scene);

    // Player health (legacy component, top-left)
    // this.healthUI = new PlayerHealthUI(scene, scene.scene.get("Start")?.player);
    this.healthbar = new UIText(scene, {
      text: `hp: ${GameState.playerStats.hp} / ${GameState.playerStats.maxHp}`,
      anchor: "top-left",
      margin: { top: 50, left: 50 },
    });
    // Subscribe to changes
    GameState.playerStats.subscribe((hp, maxHp) => {
      this.healthbar.setText(`hp: ${hp} / ${maxHp}`);
    });
    this.container.add(this.healthbar.container);

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
    this.shardsText = new UIText(scene, {
      text: ` ${GameState.dataShards.count}`,
      anchor: "top-right",
      font: "bigFont",
      margin: { top: 24, right: 70 },
    });

    GameState.dataShards.subscribe((count) => {
      this.shardsText.setText(`Shards: ${count}`);
    });

    this.container.add(this.shardsText.container);

    // React to currency changes
    scene.events.on("currency-changed", (value) => {
      text.setText(value);
      this.currency.setSize(text.width, text.height);
    });

    this.show();
  }
}
