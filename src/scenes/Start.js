import { createAnimations } from "../systems/AnimationFactory.js";
import { GameState } from "../GameState.js";
import { Player } from "../entities/Player.js";
import { EnemyBase } from "../entities/enemies/EnemyBase.js";

export class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {}

  create() {
    // --- PAUSE SYSTEM ---
    this.isPaused = false;

    this.pauseKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.P
    );
    // ======================
    const key = GameState.selectedDigimon;

    createAnimations(this, key);

    this.player = new Player(this, 200, 200, key);

    // this.ground = this.physics.add
    //   .staticImage(480, 400, null)
    //   .setDisplaySize(960, 10)
    //   .refreshBody();

    this.ground = this.add
      .tileSprite(200, 400, 1480, 25, "ground")
      .setScale(1, 1.8);

    this.physics.add.existing(this.ground, true);

    this.physics.add.collider(this.player, this.ground);

    this.cursors = this.input.keyboard.createCursorKeys();

    // ==========( HITBOXES)================
    this.attackHitboxes = this.physics.add.group();

    // ==============(ENEMIES)=========
    this.enemies = this.physics.add.group();

    createAnimations(this, "gabumon");

    const enemy = new EnemyBase(this, 500, 100, "gabumon");
    this.enemies.add(enemy);
    this.physics.add.collider(this.enemies, this.ground);

    this.physics.add.overlap(
      this.enemies,
      this.attackHitboxes,
      (enemy, hitbox) => {
        enemy.takeDamage(hitbox.damage);
        hitbox.destroy();
      }
    );

    // ==========================
    this.physics.world.createDebugGraphic();

    // Optional: make debug clearer
    this.physics.world.debugGraphic.setAlpha(0.75);
    // =====================
  }

  update() {
    // Toggle pause
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.isPaused = !this.isPaused;

      if (this.isPaused) {
        this.physics.world.pause();
        this.anims.pauseAll();
        console.log("⏸️ PAUSED");
      } else {
        this.physics.world.resume();
        this.anims.resumeAll();
        console.log("▶️ RESUMED");
      }
    }

    // Stop all updates while paused
    if (this.isPaused) return;
    // ======================================
    this.player.update(this.cursors);
  }
}
