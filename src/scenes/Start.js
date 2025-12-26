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
    const key = GameState.selectedDigimon;

    createAnimations(this, key);

    this.player = new Player(this, 200, 200, key);

    this.ground = this.physics.add
      .staticImage(480, 400, null)
      .setDisplaySize(960, 10)
      .refreshBody();

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
  }

  update() {
    this.player.update(this.cursors);
  }
}
