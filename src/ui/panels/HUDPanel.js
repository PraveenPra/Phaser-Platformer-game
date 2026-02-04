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

    // Player health
    const startScene = scene.scene.get("Start");
    const player = scene.registry.get("player");

    // this.healthUI = new PlayerHealthUI(scene, scene.scene.get("Start")?.player);
    this.healthbar = new UIText(scene, {
      text: `HP: ${player?.stats.runtime.currentHp} / ${player?.stats.maxHp}`,
      anchor: "top-left",
      font: "bigFont",
      margin: { top: 100, left: 150 },
    });

    this.container.add(this.healthbar.container);
    // Subscribe to changes
    startScene.events.on("player-hp-changed", (hp, maxHp) => {
      this.healthbar.setText(`HP: ${Math.ceil(hp)} / ${maxHp}`);
    });

    // this.container.add(this.healthbar.container);

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
