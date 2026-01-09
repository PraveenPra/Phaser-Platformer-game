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

    // Single territory definition (Mario-style)
    this.territoryRadius = 220;
    this.disengageRadius = 320;

    // Patrol stays inside territory
    this.patrolRadius = this.territoryRadius;

    // =========================
    // COMBAT
    // =========================
    this.attackRange = 60;
    this.attackBuffer = 6;

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
    this.edgeTurnCooldown = 250; // ms
    this.edgeTurnTimer = 0;

    // =========================
    // RETURN HOME
    // =========================
    this.returnTolerance = 6; // px close enough to home

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
    // INIT ONCE
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
    const dxEnemy = player.x - entity.x;
    const absDxEnemy = Math.abs(dxEnemy);

    const dxSpawn = player.x - this.spawnX;
    const absDxSpawn = Math.abs(dxSpawn);

    // =========================
    // MODE SWITCHING (TERRITORY)
    // =========================
    const enemyDistFromSpawn = Math.abs(entity.x - this.spawnX);

    if (
      this.mode === "patrol" &&
      absDxEnemy <= this.territoryRadius &&
      enemyDistFromSpawn <= this.territoryRadius
    ) {
      this.mode = "aggro";
      this.loseAggroTimer = 0;
    }

    if (this.mode === "aggro" && absDxSpawn > this.disengageRadius) {
      this.loseAggroTimer += dt;

      if (this.loseAggroTimer >= this.loseAggroDelay) {
        this.mode = "return";
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
      this.updateAggro(entity, dxEnemy, absDxEnemy);
    } else if (this.mode === "return") {
      this.updateReturn(entity);
    }

    // =========================
    // DEBUG
    // =========================
    if (this.debug) {
      this.drawDebug(entity);
    }
  }

  // =========================
  // PATROL (EDGE SAFE)
  // =========================
  updatePatrol(entity, dt) {
    this.edgeTurnTimer -= dt;

    const leftLimit = this.spawnX - this.patrolRadius;
    const rightLimit = this.spawnX + this.patrolRadius;

    // spatial patrol bounds
    let turned = false;

    // territory bounds first (authoritative)
    if (entity.x <= leftLimit) {
      console.warn("[TURN] LEFT LIMIT HIT");

      this.direction = 1;
      turned = true;
    } else if (entity.x >= rightLimit) {
      console.warn("[TURN] right LIMIT HIT");

      this.direction = -1;
      turned = true;
    }

    // edge safety only if NOT already turned
    if (!turned && this.edgeTurnTimer <= 0) {
      const hasGround = this.hasGroundAhead(entity);

      console.warn(
        "[EDGE CHECK]",
        "x=",
        entity.x.toFixed(1),
        "dir=",
        this.direction,
        "hasGround=",
        hasGround
      );

      if (!hasGround) {
        console.error("[TURN] EDGE DETECTED");
        this.turn();
        this.edgeTurnTimer = this.edgeTurnCooldown;
      }
    }

    entity.input = {
      left: this.direction < 0,
      right: this.direction > 0,
    };

    console.log(
      "[PATROL]",
      "x=",
      entity.x.toFixed(1),
      "dir=",
      this.direction,
      "L=",
      leftLimit.toFixed(1),
      "R=",
      rightLimit.toFixed(1)
    );
  }

  // =========================
  // AGGRO
  // =========================
  updateAggro(entity, dxEnemy, absDxEnemy) {
    const dir = dxEnemy < 0 ? -1 : 1;

    entity.visual.flip(dir < 0);

    // attack gate
    if (
      absDxEnemy <= this.attackRange - this.attackBuffer &&
      entity.canAttack("main") &&
      !entity.isAttacking
    ) {
      entity.input = { attackMain: true };
      return;
    }

    entity.input = {
      left: dir < 0,
      right: dir > 0,
    };
  }

  // =========================
  // RETURN TO HOME (SMOOTH)
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
  // EDGE CHECK (RAYCAST)
  // =========================
  hasGroundAhead(entity) {
    const body = entity.bodyLayer.body;
    const scene = entity.scene;

    const dir = this.direction;
    const x = body.x + body.width / 2 + dir * this.edgeCheckDistance;
    // const y = body.y + body.height + 2;
    const y = entity.y + entity.body.height / 2 + this.edgeCheckDepth;

    // check tilemap layers
    const layers = scene.groundLayer ? [scene.groundLayer] : [];

    for (const layer of layers) {
      const tile = layer.getTileAtWorldXY(x, y);
      console.error(
        "[GROUND PROBE]",
        "x=",
        x.toFixed(1),
        "y=",
        y.toFixed(1),
        "tile=",
        tile ? tile.index : null,
        "collides=",
        tile?.collides
      );

      if (tile && tile.collides) {
        return true;
      }
    }

    return false;
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

    const y = entity.y - 12;

    // territory
    g.lineStyle(1, 0xffff00, 0.4);
    g.strokeCircle(this.spawnX, y, this.territoryRadius);

    // disengage
    g.lineStyle(1, 0x00ffff, 0.3);
    g.strokeCircle(this.spawnX, y, this.disengageRadius);

    // attack
    g.lineStyle(1, 0xff0000, 0.7);
    g.strokeCircle(entity.x, y, this.attackRange);

    // edge probe
    const dir = this.direction;
    g.lineStyle(1, 0x00ff00, 0.8);
    g.strokeCircle(entity.x + dir * this.edgeCheckDistance, entity.y + 12, 3);

    // Patrol territory
    g.lineStyle(1, 0x00ff00, 0.4);
    g.strokeLineShape(
      new Phaser.Geom.Line(
        this.spawnX - this.patrolRadius,
        entity.y,
        this.spawnX + this.patrolRadius,
        entity.y
      )
    );
  }
}
