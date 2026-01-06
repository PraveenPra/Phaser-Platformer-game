export class EnemyAI {
  constructor(scene, entity) {
    // ===== Patrol =====
    this.direction = 1;
    this.mode = "patrol";

    this.patrolTimer = 0;
    this.patrolInterval = 600;

    // ===== Aggro / Combat =====
    this.aggroRange = 220;
    this.attackRange = 60;
    this.attackBuffer = 6; // ✅ REQUIRED
    this.disengageRange = 280;

    this.loseAggroTimer = 0;
    this.loseAggroDelay = 800;

    // ===== Leash =====
    this.spawnX = null;
    this.maxChaseDistance = 300;

    // ===== Debug =====
    // ===== Debug =====
    this.debug = true;
    this.debugGfx = null; // ✅ lazy init
  }

  update(entity, dt) {
    // ===== Init spawn position once =====
    if (this.spawnX === null) {
      this.spawnX = entity.x;
    }

    // ===== Init debug graphics once =====
    if (this.debug && !this.debugGfx) {
      this.debugGfx = entity.scene.add.graphics();
      this.debugGfx.setDepth(9999);
    }
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
    const distFromSpawn = Math.abs(entity.x - this.spawnX);

    // =========================
    // MODE SWITCHING
    // =========================
    if (this.mode === "patrol" && absDx <= this.aggroRange) {
      this.mode = "aggro";
      this.loseAggroTimer = 0;
    }

    if (
      this.mode === "aggro" &&
      (absDx > this.disengageRange || distFromSpawn > this.maxChaseDistance)
    ) {
      this.loseAggroTimer += dt;
      if (this.loseAggroTimer >= this.loseAggroDelay) {
        this.mode = "patrol";
        this.turn();
        entity.input = {};
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

    // =========================
    // DEBUG DRAW
    // =========================
    if (this.debug) {
      this.drawDebug(entity);
    }

    if (this.debug && this.debugGfx) {
      this.debugGfx.clear();

      // aggro range (yellow)
      this.debugGfx.lineStyle(1, 0xffff00, 0.6);
      this.debugGfx.strokeCircle(entity.x, entity.y, this.aggroRange);

      // attack range (red)
      this.debugGfx.lineStyle(1, 0xff0000, 0.8);
      this.debugGfx.strokeCircle(entity.x, entity.y, this.attackRange);
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

    // ===== ATTACK =====
    if (
      absDx <= this.attackRange &&
      entity.canAttack("main") &&
      !entity.isAttacking
    ) {
      entity.input = { attackMain: true };
      return;
    }

    // ===== CHASE =====
    entity.input = {
      left: dirToPlayer < 0,
      right: dirToPlayer > 0,
    };
  }

  turn() {
    this.direction *= -1;
  }

  // =========================
  // DEBUG VISUALS
  // =========================
  drawDebug(entity) {
    const g = this.debugGfx;
    g.clear();

    // Aggro range
    g.lineStyle(1, 0xffff00, 0.5);
    g.strokeCircle(entity.x, entity.y - 12, this.aggroRange);

    // Attack range
    g.lineStyle(1, 0xff0000, 0.8);
    g.strokeCircle(entity.x, entity.y - 12, this.attackRange);

    // Disengage
    g.lineStyle(1, 0x00ffff, 0.3);
    g.strokeCircle(entity.x, entity.y - 12, this.disengageRange);

    // Leash
    g.lineStyle(1, 0x00ff00, 0.3);
    g.strokeLineShape(
      new Phaser.Geom.Line(
        this.spawnX - this.maxChaseDistance,
        entity.y - 24,
        this.spawnX + this.maxChaseDistance,
        entity.y - 24
      )
    );
  }
}
