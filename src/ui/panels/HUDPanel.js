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
    // const startScene = scene.scene.get("Start");
    // const player = GameState.player;

    // this.healthUI = new PlayerHealthUI(scene, scene.scene.get("Start")?.player);
    this.healthbar = new UIText(scene, {
      text: "HP: -- / --",
      anchor: "top-left",
      margin: { top: 50, left: 50 },
    });

    this.container.add(this.healthbar.container);

    // Subscribe to changes
    // 🔥 Subscribe when player is available
    const player = GameState.player;

    if (player?.stats) {
      this.bindPlayer(player);
    }

    // 🔁 Handle player swap / scene restart
    GameState.events.on("player-set", (player) => {
      this.bindPlayer(player);
    });

    // this.show();

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

  bindPlayer(player) {
    // cleanup old binding
    this._unbindStats?.();

    const stats = player.stats;

    const onHpChanged = (hp, maxHp) => {
      this.healthbar.setText(`HP: ${hp} / ${maxHp}`);
    };

    stats.on("hp-changed", onHpChanged);

    // force refresh immediately
    onHpChanged(stats.runtime.currentHp, stats.maxHp);

    this._unbindStats = () => {
      stats.off("hp-changed", onHpChanged);
    };
  }
}
