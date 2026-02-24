import { registerGlobalAnimations } from "/src/systems/animations/AnimationRegistry.js";
import { SceneControls } from "/src/utils/SceneControls.js";
import { NarrativeSystem } from "/src/systems/NarrativeSystem.js";
import { Player } from "/src/entities/Player/Player.js";
import { createAnimations } from "/src/systems/AnimationFactory.js";
import { PlayerHealthUI } from "/src/ui/PlayerHealthUI.js";
import { GameState } from "/src/GameState.js";
export class BaseLevelScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  create() {
    // Global animations (safe to call once per scene)
    registerGlobalAnimations(this);

    // =================================================
    // UI SCENE (persistent HUD)
    // =================================================
    if (!this.scene.isActive("UIScene")) {
      this.scene.launch("UIScene");
      this.scene.bringToTop("UIScene");
    }

    // =================================================
    // DEV SCENE CONTROLS
    // =================================================
    this.sceneControls = new SceneControls(this, {
      keyPause: "ESC",
    });

    // =================================================
    // NARRATIVE SYSTEM
    // =================================================
    this.narrative = new NarrativeSystem(this);

    const cleanup = () => {
      this.narrative?.destroy();
      this.narrative = null;
      this.sceneControls?.destroy();
      this.sceneControls = null;
    };

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    this.events.once(Phaser.Scenes.Events.DESTROY, cleanup);
  }

  // =================================================
  // PLAYER SPAWNER (shared by all levels)
  // =================================================
  spawnPlayer(x, y, key) {
    createAnimations(this, key);

    const player = new Player(this, x, y, key);
    player.body.setCollideWorldBounds(true);

    // Player ↔ ground
    if (this.groundLayer) {
      this.physics.add.collider(player, this.groundLayer);
    }

    // Player ↔ enemies
    if (this.enemies) {
      this.physics.add.collider(player, this.enemies);
    }

    // Camera follow
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    // UI
    this.playerHealthUI?.destroy();
    this.playerHealthUI = new PlayerHealthUI(this, player);

    this.player = player;

    // expose player
    this.registry.set("player", player);
    GameState.setPlayer(player);

    return player;
  }
}
