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
      this._mobileControls?.forEach((btn) => btn.destroy());
      this._mobileControls = null;
    };

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    this.events.once(Phaser.Scenes.Events.DESTROY, cleanup);

    // When player falls into a pit (world bounds), kill them
    this.onPitFall();
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

  onPitFall() {
    this.physics.world.on("worldbounds", (body) => {
      if (!this.player || this.player.isDead) return;

      if (body === this.player.bodyLayer?.body) {
        if (
          body.blocked.down &&
          !body.blocked.left &&
          !body.blocked.right &&
          !body.blocked.up
        ) {
          this.player.forceKill("void");
        }
      }
    });
  }

  createMobileControls() {
    const size = 64;
    const cam = this.cameras.main;

    const makeBtn = (x, y, frame) =>
      this.add
        .sprite(x, y, "mobile-buttons", frame)
        .setInteractive()
        .setScrollFactor(0)
        .setDepth(1000)
        .setOrigin(0.5)
        .setDisplaySize(size, size);

    const leftBtn = makeBtn(50, cam.height - 50, "mb-left-button");
    const rightBtn = makeBtn(150, cam.height - 50, "mb-right-button");
    const jumpBtn = makeBtn(cam.width - 150, cam.height - 50, "mb-jump-button");
    const attackBtn = makeBtn(
      cam.width - 50,
      cam.height - 50,
      "mb-attack-main-button",
    );

    const attackSkill1Btn = makeBtn(
      cam.width - 150,
      cam.height - 150,
      "mb-attack-skill1",
    );
    const attackSkill2Btn = makeBtn(
      cam.width - 50,
      cam.height - 150,
      "mb-attack-skill2",
    );

    const link = (btn, key) => {
      btn.on(
        "pointerdown",
        () => (this.player.inputHandler.virtual[key] = true),
      );
      btn.on(
        "pointerup",
        () => (this.player.inputHandler.virtual[key] = false),
      );
      btn.on(
        "pointerout",
        () => (this.player.inputHandler.virtual[key] = false),
      );
    };

    link(leftBtn, "left");
    link(rightBtn, "right");
    link(jumpBtn, "jump");
    link(attackBtn, "attackMain");
    link(attackSkill1Btn, "attackSkill1");
    link(attackSkill2Btn, "attackSkill2");

    this._mobileControls = [
      leftBtn,
      rightBtn,
      jumpBtn,
      attackBtn,
      attackSkill1Btn,
      attackSkill2Btn,
    ];
  }
}
