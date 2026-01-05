export class EnemyAI {
  constructor() {
    // ===== Patrol =====
    this.direction = 1;
    this.mode = "patrol";

    this.patrolTimer = 0;
    this.patrolInterval = 600;

    // ===== Aggro / Combat =====
    this.aggroRange = 220;
    this.attackRange = 60;
    this.disengageRange = 280;

    this.loseAggroTimer = 0;
    this.loseAggroDelay = 800; // ms
  }

  update(entity, dt) {
    const scene = entity.scene;
    const player = scene.player;

    // ===== Safety =====
    if (!player || entity.isDead) {
      entity.input = {};
      return;
    }

    if (entity.state.current === "hit" || entity.state.current === "dead") {
      entity.input = {};
      return;
    }

    const dx = player.x - entity.x;
    const absDx = Math.abs(dx);

    // =========================
    // MODE SWITCHING
    // =========================
    if (this.mode === "patrol" && absDx <= this.aggroRange) {
      this.mode = "aggro";
      this.loseAggroTimer = 0;
    }

    if (this.mode === "aggro" && absDx > this.disengageRange) {
      this.loseAggroTimer += dt;
      if (this.loseAggroTimer >= this.loseAggroDelay) {
        this.mode = "patrol";
        this.turn();
        return;
      }
    } else {
      this.loseAggroTimer = 0;
    }

    // =========================
    // BEHAVIOR
    // =========================
    if (this.mode === "patrol") {
      this.updatePatrol(entity, dt);
    } else {
      this.updateAggro(entity, dx, absDx);
    }
  }

  // =========================
  // PATROL
  // =========================
  updatePatrol(entity, dt) {
    this.patrolTimer += dt;

    if (this.patrolTimer >= this.patrolInterval) {
      this.turn();
      this.patrolTimer = 0;
    }

    entity.input = {
      left: this.direction < 0,
      right: this.direction > 0,
    };
  }

  // =========================
  // AGGRO / ATTACK
  // =========================
  updateAggro(entity, dx, absDx) {
    const dirToPlayer = dx < 0 ? -1 : 1;

    // face player
    entity.visual.flip(dirToPlayer < 0);

    // ===== Attack gate =====
    if (
      absDx <= this.attackRange &&
      entity.canAttack("main") &&
      !entity.isAttacking
    ) {
      entity.input = { attackMain: true };
      return;
    }

    // ===== Chase =====
    entity.input = {
      left: dirToPlayer < 0,
      right: dirToPlayer > 0,
    };
  }

  turn() {
    this.direction *= -1;
  }
}
