export class EnemyAI {
  constructor(config = {}) {
    // =========================
    // ENGAGEMENT (PHASE 3A)
    // =========================
    const e = config.engagement ?? {};

    this.aggroRadius = e.aggroRadius ?? 220;
    this.disengageRadius = e.disengageRadius ?? 320;
    this.commitDelay = e.commitDelay ?? 0;
    this.chaseConfidence = e.chaseConfidence ?? 0.6;

    this.commitTimer = 0;

    // =========================
    // PATROL
    // =========================
    this.direction = 1;
    this.mode = "patrol";

    // =========================
    // TERRITORY
    // =========================
    this.spawnX = null;
    this.patrolRadius = this.aggroRadius;

    // =========================
    // COMBAT
    // =========================
    this.attackRange = 50;
    this.attackBuffer = 14;

    // =========================
    // AGGRO TIMING (legacy-safe)
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

    // =========================
    // ATTACK DECISION (PHASE 3B.1)
    // =========================
    this.chosenAttack = null;
    this.attackDecisionCooldown = 0;

    // =========================
    // POST ATTACK SEQUENCING (3B.3)
    // =========================
    this.sequence = null; // "pause" | "retreat" | "hold" | "reengage"
    this.sequenceTimer = 0;

    // =========================
    // DEBUG
    // =========================
    this.debug = false;
    this.debugGfx = null;
  }

  update(entity, dt) {
    const bias = entity.archetype?.behaviorBias ?? {};
    const aggression = bias.aggression ?? 1;
    const recovery = bias.recovery ?? 1;
    const preferredRange = bias.preferredRange ?? this.attackRange;

    // =========================
    // SEQUENCING OVERRIDE (3B.3)
    // =========================
    if (this.sequenceTimer > 0) {
      this.updateSequencing(entity, dt);
      return; // ⛔ blocks all other AI
    }

    // =========================
    // ATTACK DECISION COOLDOWN
    // =========================
    if (this.attackDecisionCooldown > 0) {
      this.attackDecisionCooldown -= dt;
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
    // DEBUG CLEANUP
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
      this.chosenAttack = null;
      return;
    }

    if (entity.state.current === "hit" || entity.state.current === "dead") {
      entity.input = {};
      return;
    }

    // =========================
    // DISTANCE CALC
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
    // ENGAGEMENT LOGIC (PHASE 3A)
    // =========================
    if (this.mode === "patrol" && absDxSpawn <= this.aggroRadius) {
      this.commitTimer += dt;

      if (this.commitTimer >= this.commitDelay) {
        this.mode = "aggro";
        this.commitTimer = 0;
        this.attackTimer = 0;
      }

      entity.input = {};
      return;
    } else {
      this.commitTimer = 0;
    }

    const effectiveDisengage = this.disengageRadius * this.chaseConfidence;

    if (this.mode === "aggro" && absDxSpawn > effectiveDisengage) {
      this.loseAggroTimer += dt;

      if (this.loseAggroTimer >= this.loseAggroDelay) {
        this.mode = "return";
        this.attackTimer = 0;
        this.chosenAttack = null;
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
      this.updateAggro(
        entity,
        dxEnemy,
        absDxEnemy,
        dt,
        preferredRange,
        aggression,
      );
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
  // AGGRO (UNCHANGED COMBAT)
  // =========================
  updateAggro(entity, dxEnemy, absDxEnemy, dt, preferredRange, aggression) {
    const player = entity.scene.player;
    const dir = player.x < entity.x ? -1 : 1;
    entity.visual.flip(dir < 0);
    this.direction = dir;

    // =========================
    // ATTACK DECISION (LOCKED)
    // =========================
    if (!this.chosenAttack && this.attackDecisionCooldown <= 0) {
      const player = entity.scene.player;

      this.chosenAttack =
        entity.pickAttack?.({
          distance: absDxEnemy,
          now: performance.now(),

          // Phase 3B.2 context
          playerAirborne: !player.body.blocked.down,
          playerAttacking: player.isAttacking,
          enemyHpPct: entity.stats.hp / entity.stats.maxHp,
        }) ?? "main";

      this.attackDecisionCooldown = 200;
      console.log(entity.role, "picked", this.chosenAttack);
    }

    const attackKey = this.chosenAttack;
    const attackData = entity.profile.attacks?.[attackKey];
    if (!attackData) return;

    const isProjectile = attackData.type === "projectile";

    // ---------- MELEE ----------
    if (!isProjectile) {
      const meleeContactDistance = 6;

      if (absDxEnemy <= meleeContactDistance) {
        this.attackTimer += dt * aggression;

        entity.input = {};

        if (
          this.attackTimer >= this.attackWindup &&
          entity.canAttack(attackKey) &&
          !entity.isAttacking
        ) {
          entity.input = {
            attack: attackKey, // "main", "skill1", "skill2", etc
          };
          entity.commitAttack(attackKey);
          this.chosenAttack = null;
          this.startPostAttackSequence(entity);

          this.attackTimer = 0;
        }
        return;
      }

      if (absDxEnemy <= preferredRange) {
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

    // ---------- PROJECTILE ----------
    const projectileMinDistance = 28;
    const projectileFireDistance = this.attackRange;

    if (absDxEnemy < projectileMinDistance) {
      entity.input = {
        left: dir > 0,
        right: dir < 0,
      };
      this.attackTimer = 0;
      return;
    }

    if (absDxEnemy <= projectileFireDistance) {
      this.attackTimer += dt * aggression;

      entity.input = {};

      if (
        this.attackTimer >= this.attackWindup &&
        entity.canAttack(attackKey) &&
        !entity.isAttacking
      ) {
        entity.input = {
          attack: attackKey, // "main", "skill1", "skill2", etc
        };
        entity.commitAttack(attackKey);
        this.chosenAttack = null;
        this.startPostAttackSequence(entity);

        this.attackTimer = 0;
      }
      return;
    }

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

  updateSequencing(entity, dt) {
    this.sequenceTimer -= dt;
    entity.input = {};

    const player = entity.scene.player;
    if (!player) return;

    const dir = player.x < entity.x ? -1 : 1;
    entity.visual.flip(dir < 0);

    switch (this.sequence) {
      case "pause":
      case "hold":
        // intentional stillness
        break;

      case "retreat":
        entity.input = {
          left: dir > 0,
          right: dir < 0,
        };
        break;

      case "reengage":
        entity.input = {
          left: dir < 0,
          right: dir > 0,
        };
        break;
    }

    if (this.sequenceTimer <= 0) {
      this.sequence = null;
    }
  }

  startPostAttackSequence(entity) {
    const archetype = entity.archetype ?? {};

    this.sequence =
      archetype.postAttackSequence ??
      Phaser.Utils.Array.GetRandom(["pause", "hold"]);

    this.sequenceTimer = archetype.sequenceDuration ?? 300;
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
    g.strokeCircle(this.spawnX, y, this.aggroRadius);

    g.lineStyle(1, 0x00ffff, 0.3);
    g.strokeCircle(this.spawnX, y, this.disengageRadius * this.chaseConfidence);
  }

  destroyDebug() {
    if (this.debugGfx) {
      this.debugGfx.clear();
      this.debugGfx.destroy();
      this.debugGfx = null;
    }
  }
}
