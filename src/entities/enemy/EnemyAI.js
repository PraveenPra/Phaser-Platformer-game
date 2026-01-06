export class EnemyAI {
  constructor() {
    // =========================
    // PATROL
    // =========================
    this.direction = 1;
    this.mode = "patrol";

    this.patrolTimer = 0;
    this.patrolInterval = 600;

    // =========================
    // TERRITORY (FIXED ZONE)
    // =========================
    this.spawnX = null; // enemy home position
    this.territoryRadius = 220; // player must be within THIS to aggro
    this.disengageRadius = 260; // player leaves THIS → disengage

    // =========================
    // COMBAT
    // =========================
    this.attackRange = 60;
    this.attackBuffer = 6; // prevents edge jitter

    // =========================
    // AGGRO TIMING
    // =========================
    this.loseAggroTimer = 0;
    this.loseAggroDelay = 800; // ms before disengage

    // =========================
    // DEBUG
    // =========================
    this.debug = true;
    this.debugGfx = null;
  }

  update(entity, dt) {
    const scene = entity.scene;
    const player = scene.player;

    // =========================
    // INIT (ONCE)
    // =========================
    if (this.spawnX === null) {
      this.spawnX = entity.x;
    }

    if (this.debug && !this.debugGfx) {
      this.debugGfx = scene.add.graphics();
      this.debugGfx.setDepth(9999);
    }

    // =========================
    // SAFETY
    // =========================
    if (!player || entity.isDead) {
      entity.input = {};
      return;
    }

    if (entity.state.current === "hit" || entity.state.current === "dead") {
      entity.input = {};
      return;
    }

    // =========================
    // DISTANCES
    // =========================
    const dxEnemy = player.x - entity.x; // movement
    const absDxEnemy = Math.abs(dxEnemy);

    const dxSpawn = player.x - this.spawnX; // TERRITORY CHECK
    const absDxSpawn = Math.abs(dxSpawn);

    // =========================
    // MODE SWITCHING (TERRITORY-BASED)
    // =========================
    if (this.mode === "patrol" && absDxSpawn <= this.territoryRadius) {
      this.mode = "aggro";
      this.loseAggroTimer = 0;
    }

    if (this.mode === "aggro" && absDxSpawn > this.disengageRadius) {
      this.loseAggroTimer += dt;

      if (this.loseAggroTimer >= this.loseAggroDelay) {
        this.mode = "patrol";
        this.turn(); // looks natural when returning
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
      this.updateAggro(entity, dxEnemy, absDxEnemy);
    }

    // =========================
    // DEBUG
    // =========================
    if (this.debug) {
      this.drawDebug(entity);
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
  updateAggro(entity, dxEnemy, absDxEnemy) {
    const dir = dxEnemy < 0 ? -1 : 1;

    // face player
    entity.visual.flip(dir < 0);

    // ===== ATTACK (RANGE GATED) =====
    if (
      absDxEnemy <= this.attackRange - this.attackBuffer &&
      entity.canAttack("main") &&
      !entity.isAttacking
    ) {
      entity.input = { attackMain: true };
      return;
    }

    // ===== CHASE (BUT STILL INSIDE TERRITORY) =====
    entity.input = {
      left: dir < 0,
      right: dir > 0,
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

    const y = entity.y - 12;

    // Territory (yellow)
    g.lineStyle(1, 0xffff00, 0.4);
    g.strokeCircle(this.spawnX, y, this.territoryRadius);

    // Disengage (cyan)
    g.lineStyle(1, 0x00ffff, 0.3);
    g.strokeCircle(this.spawnX, y, this.disengageRadius);

    // Attack range (red, enemy-centered)
    g.lineStyle(1, 0xff0000, 0.7);
    g.strokeCircle(entity.x, y, this.attackRange);
  }
}
