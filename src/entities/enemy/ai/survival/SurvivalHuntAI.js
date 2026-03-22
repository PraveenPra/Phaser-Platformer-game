import { SurvivalBaseAI } from "./SurvivalBaseAI.js";

export class SurvivalHuntAI extends SurvivalBaseAI {
  constructor() {
    super();

    this.attackRange = 36;
    this.attackWindup = 220;

    this.attackTimer = 0;

    // NEW
    this.recoveryTimer = 0;
    this.attackRecovery = 500; // gap between attacks
  }

  updateAggroMode(entity, dt) {
    const player = entity.scene.player;

    const enemyBody = entity.bodyLayer.body;
    const playerBody = player.bodyLayer.body;

    let dxEnemy;

    if (player.x < entity.x) {
      dxEnemy = enemyBody.left - playerBody.right;
    } else {
      dxEnemy = playerBody.left - enemyBody.right;
    }

    const absDx = Math.abs(dxEnemy);
    const dir = player.x < entity.x ? -1 : 1;

    entity.visual.flip(dir < 0);

    // =========================
    // LOCK WHILE ATTACKING
    // =========================
    if (entity.isAttacking) {
      entity.input = {};
      this.attackTimer = 0;
      return;
    }

    // =========================
    // RECOVERY WINDOW
    // =========================
    if (this.recoveryTimer > 0) {
      this.recoveryTimer -= dt;
      entity.input = {};
      return;
    }

    // =========================
    // ATTACK RANGE
    // =========================
    const meleeContactDistance = 6;

    if (absDx <= meleeContactDistance) {
      entity.input = {}; // stop movement

      this.attackTimer += dt;

      if (
        this.attackTimer >= this.attackWindup &&
        entity.canAttack("main") &&
        !entity.isAttacking
      ) {
        entity.input = {
          attack: "main",
        };

        entity.commitAttack("main");

        this.attackTimer = 0;

        // START GAP
        this.recoveryTimer = this.attackRecovery;
      }

      return;
    }

    // =========================
    // CHASE PLAYER
    // =========================

    this.attackTimer = 0;

    entity.input = {
      left: dir < 0,
      right: dir > 0,
    };
  }
}
