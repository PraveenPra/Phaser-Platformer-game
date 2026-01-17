export class EnemyAI {
  constructor() {
    // =========================
    // PATROL
    // =========================
    this.direction = 1;
    this.mode = "patrol";

    // =========================
    // TERRITORY (FIXED)
    // =========================
    this.spawnX = null;

    this.territoryRadius = 220;
    this.disengageRadius = 320;
    this.patrolRadius = this.territoryRadius;

    // =========================
    // COMBAT
    // =========================
    this.attackRange = 50;
    this.attackBuffer = 14;

    // =========================
    // AGGRO TIMING
    // =========================
    this.loseAggroTimer = 0;
    this.loseAggroDelay = 800;

    // =========================
    // EDGE DETECTION
    // =========================
    this.edgeCheckDistance = 18;
    this.edgeCheckDepth = 26;
    this.edgeTurnCooldown = 250;
    this.edgeTurnTimer = 0;

    // =========================
    // RETURN HOME
    // =========================
    this.returnTolerance = 6;

    // =========================
    // ATTACK TIMING
    // =========================
    this.attackWindup = 300;
    this.attackTimer = 0;

    this.postAttackPause = 400;
    this.postAttackTimer = 0;

    // =========================
    // DEBUG
    // =========================
    this.debug = true;
    this.debugGfx = null;
  }

  update(entity, dt) {
    // =========================
    // POST ATTACK PAUSE
    // =========================
    if (this.postAttackTimer > 0) {
      this.postAttackTimer -= dt;
      entity.input = {};
      return;
    }

    const scene = entity.scene;
    const player = scene.player;

    // =========================
    // INIT
    // =========================
    if (this.spawnX === null) {
      this.spawnX = entity.x;
    }

    // =========================
    // DEBUG CLEANUP (EARLY EXIT)
    // =========================
    if (!this.debug && this.debugGfx) {
      this.debugGfx.clear();
      this.debugGfx.destroy();
      this.debugGfx = null;
    }

    if (this.debug && !this.debugGfx) {
      this.debugGfx = scene.add.graphics().setDepth(9999);
    }

    // =========================
    // SAFETY
    // =========================
    if (
      !player ||
      player.isDead ||
      player.state?.current === "dead" ||
      entity.isDead
    ) {
      entity.input = {};
      this.attackTimer = 0;
      this.postAttackTimer = 0;
      return;
    }

    if (entity.state.current === "hit" || entity.state.current === "dead") {
      entity.input = {};
      return;
    }

    // =========================
    // DISTANCE (EDGE-BASED)
    // =========================
    const enemyBody = entity.bodyLayer.body;
    const playerBody = player.bodyLayer.body;

    let dxEnemy;
    if (player.x < entity.x) {
      dxEnemy = enemyBody.left - playerBody.right;
    } else {
      dxEnemy = playerBody.left - enemyBody.right;
    }

    const absDxEnemy = Math.abs(dxEnemy);

    const dxSpawn = player.x - this.spawnX;
    const absDxSpawn = Math.abs(dxSpawn);

    // =========================
    // DEBUG DISTANCE TRACE
    // =========================
    if (this.debug) {
      const enemyBody = entity.bodyLayer.body;
      const playerBody = player.bodyLayer.body;
    }

    // =========================
    // MODE SWITCHING
    // =========================
    if (this.mode === "patrol" && absDxSpawn <= this.territoryRadius) {
      this.mode = "aggro";
      this.loseAggroTimer = 0;
      this.attackTimer = 0;
    }

    if (this.mode === "aggro" && absDxSpawn > this.disengageRadius) {
      this.loseAggroTimer += dt;

      if (this.loseAggroTimer >= this.loseAggroDelay) {
        this.mode = "return";
        this.attackTimer = 0;
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
    } else if (this.mode === "aggro") {
      this.updateAggro(entity, dxEnemy, absDxEnemy, dt);
    } else if (this.mode === "return") {
      this.updateReturn(entity);
    }

    if (this.debug) {
      this.drawDebug(entity);
    }
  }

  // =========================
  // PATROL
  // =========================
  updatePatrol(entity, dt) {
    this.edgeTurnTimer -= dt;

    const leftLimit = this.spawnX - this.patrolRadius;
    const rightLimit = this.spawnX + this.patrolRadius;

    let turned = false;

    if (
      (this.direction === -1 && entity.body.blocked.left) ||
      (this.direction === 1 && entity.body.blocked.right)
    ) {
      this.turn();
      this.edgeTurnTimer = this.edgeTurnCooldown;
      turned = true;
    }

    if (!turned && entity.x <= leftLimit) {
      this.direction = 1;
      turned = true;
    } else if (!turned && entity.x >= rightLimit) {
      this.direction = -1;
      turned = true;
    }

    if (!turned && this.edgeTurnTimer <= 0) {
      if (!this.hasGroundAhead(entity)) {
        this.turn();
        this.edgeTurnTimer = this.edgeTurnCooldown;
      }
    }

    entity.input = {
      left: this.direction < 0,
      right: this.direction > 0,
    };
  }

  // =========================
  // AGGRO
  // =========================
  updateAggro(entity, dxEnemy, absDxEnemy, dt) {
    const player = entity.scene.player;
    const dir = player.x < entity.x ? -1 : 1;
    entity.visual.flip(dir < 0);
    this.direction = dir;

    const mainAttack = entity.profile.attacks?.main;
    const isProjectile = mainAttack?.type === "projectile";

    // =========================
    // MELEE ENEMY LOGIC
    // =========================
    if (!isProjectile) {
      const meleeContactDistance = 6;

      // Close enough to hit
      if (absDxEnemy <= meleeContactDistance) {
        this.attackTimer += dt;
        entity.input = {};

        if (
          this.attackTimer >= this.attackWindup &&
          entity.canAttack("main") &&
          !entity.isAttacking
        ) {
          entity.input = { attackMain: true };
          this.attackTimer = 0;
        }
        return;
      }

      // Need to get closer
      if (absDxEnemy <= this.attackRange) {
        entity.input = { left: dir < 0, right: dir > 0 };
        return;
      }

      this.attackTimer = 0;

      if (!this.hasGroundAhead(entity)) {
        this.mode = "return";
        entity.input = {};
        return;
      }

      entity.input = { left: dir < 0, right: dir > 0 };
      return;
    }

    // =========================
    // PROJECTILE ENEMY LOGIC
    // =========================
    const projectileMinDistance = 28;
    const projectileFireDistance = this.attackRange;

    // TOO CLOSE → back away
    if (absDxEnemy < projectileMinDistance) {
      entity.input = {
        left: dir > 0,
        right: dir < 0,
      };
      this.attackTimer = 0;
      return;
    }

    // FIRE ZONE → stand and shoot
    if (absDxEnemy <= projectileFireDistance) {
      this.attackTimer += dt;
      entity.input = {};

      if (
        this.attackTimer >= this.attackWindup &&
        entity.canAttack("main") &&
        !entity.isAttacking
      ) {
        entity.input = { attackMain: true };
        this.attackTimer = 0;
      }
      return;
    }

    // TOO FAR → move closer
    this.attackTimer = 0;

    if (!this.hasGroundAhead(entity)) {
      this.mode = "return";
      entity.input = {};
      return;
    }

    entity.input = { left: dir < 0, right: dir > 0 };
  }

  // =========================
  // RETURN
  // =========================
  updateReturn(entity) {
    const dx = this.spawnX - entity.x;
    const absDx = Math.abs(dx);

    if (absDx <= this.returnTolerance) {
      this.mode = "patrol";
      this.direction = Math.random() < 0.5 ? -1 : 1;
      entity.input = {};
      return;
    }

    const dir = dx < 0 ? -1 : 1;
    entity.visual.flip(dir < 0);

    entity.input = {
      left: dir < 0,
      right: dir > 0,
    };
  }

  // =========================
  // EDGE CHECK
  // =========================
  hasGroundAhead(entity) {
    const body = entity.bodyLayer.body;
    const scene = entity.scene;

    const dir = this.direction;
    const x = body.x + body.width / 2 + dir * this.edgeCheckDistance;
    const y = body.y + body.height + this.edgeCheckDepth;

    if (!scene.groundLayer) return false;

    const tile = scene.groundLayer.getTileAtWorldXY(x, y);
    return !!(tile && tile.collides);
  }

  turn() {
    this.direction *= -1;
  }

  // =========================
  // DEBUG
  // =========================
  drawDebug(entity) {
    const g = this.debugGfx;
    g.clear();

    const body = entity.bodyLayer.body;
    const y = entity.y - 12;

    g.lineStyle(1, 0xffff00, 0.4);
    g.strokeCircle(this.spawnX, y, this.territoryRadius);

    g.lineStyle(1, 0x00ffff, 0.3);
    g.strokeCircle(this.spawnX, y, this.disengageRadius);

    g.lineStyle(1, 0xff0000, 0.7);
    g.strokeCircle(
      this.direction < 0 ? body.left : body.right,
      y,
      this.attackRange,
    );

    g.lineStyle(1, 0x00ff00, 0.8);
    g.strokeCircle(
      entity.x + this.direction * this.edgeCheckDistance,
      entity.y + 12,
      3,
    );
  }

  destroyDebug() {
    if (this.debugGfx) {
      this.debugGfx.clear();
      this.debugGfx.destroy();
      this.debugGfx = null;
    }
  }
}
