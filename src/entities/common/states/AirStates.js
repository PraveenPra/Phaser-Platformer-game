export const AirStates = {
  idle: {
    enter(entity) {
      const body = entity.bodyLayer.body;
      const move = entity.profile.move;

      // ✅ flying physics
      body.setAllowGravity(false);
      body.setDrag(move.airDecel, move.airDecel);
      body.setAcceleration(0, 0);

      // entity.visual.play(`${entity.key}_idle`, true);
      // ▶ play same fly anim but slower
      entity.visual.play(`${entity.key}_fly`, true);
      entity.visual.sprite.anims.timeScale = 0.3;

      entity.movement.stop();

      // 🪶 hover container, not visual
      entity._hoverTween = entity.scene.tweens.add({
        targets: entity,
        y: entity.y - 8,
        duration: 700,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    },

    update(entity) {
      if (entity.isDead || entity.state.current === "hit") return;

      // ✅ movement
      if (
        entity.input?.left ||
        entity.input?.right ||
        entity.input?.up ||
        entity.input?.down
      ) {
        entity.state.setState("fly");
        return;
      }

      // ✅ ATTACKS (THIS WAS MISSING)
      if (entity.input?.attackMain) {
        entity.requestedAttack = "main";
        entity.state.setState("attack");
        return;
      }

      if (entity.input?.attackSkill1) {
        entity.requestedAttack = "skill1";
        entity.state.setState("attack");
        return;
      }

      if (entity.input?.attackSkill2) {
        entity.requestedAttack = "skill2";
        entity.state.setState("attack");
        return;
      }
    },

    exit(entity) {
      const body = entity.bodyLayer.body;

      body.setDrag(0, 0);
      body.setAcceleration(0, 0);

      if (entity._hoverTween) {
        entity._hoverTween.stop();
        entity._hoverTween = null;
      }

      entity.visual.sprite.anims.timeScale = 1;
    },
  },

  fly: {
    enter(entity) {
      const body = entity.bodyLayer.body;
      body.setAllowGravity(false); // fly physics

      body.setDrag(0, 0);

      entity.visual.play(`${entity.key}_fly`, true);
      entity.visual.sprite.anims.timeScale = 1;

      if (entity.bodyLayer.body.onFloor()) {
        if (entity.profile.movement?.mode === "multi-domain") {
          entity.movement.switchDomain("ground");
          entity.state.setState("idle");
          return;
        }
      }
    },

    update(entity) {
      if (entity.isDead || entity.state.current === "hit") return;

      let moving = false;

      if (entity.input?.left) {
        entity.movement.moveHorizontal(-1);
        moving = true;
      } else if (entity.input?.right) {
        entity.movement.moveHorizontal(1);
        moving = true;
      } else {
        entity.bodyLayer.body.setVelocityX(0);
      }

      if (entity.input?.up) {
        entity.movement.moveVertical(-1);
        moving = true;
      } else if (entity.input?.down) {
        entity.movement.moveVertical(1);
        moving = true;
      } else {
        entity.bodyLayer.body.setVelocityY(0);
      }

      const body = entity.bodyLayer.body;
      const len = Math.hypot(body.velocity.x, body.velocity.y);
      const max = entity.profile.move.maxAirSpeed;

      if (len > max) {
        body.velocity.scale(max / len);
      }

      if (!moving) {
        entity.state.setState("idle");
        return;
      }

      // ✅ ATTACKS (ALSO MISSING)
      if (entity.input?.attackMain) {
        entity.requestedAttack = "main";
        entity.state.setState("attack");
        return;
      }

      if (entity.input?.attackSkill1) {
        entity.requestedAttack = "skill1";
        entity.state.setState("attack");
        return;
      }

      if (entity.input?.attackSkill2) {
        entity.requestedAttack = "skill2";
        entity.state.setState("attack");
        return;
      }
    },

    exit(entity) {
      const body = entity.bodyLayer.body;

      body.setAcceleration(0, 0);
      body.setDrag(0, 0);
    },
  },

  attack: {
    enter(entity) {
      const attackKey = entity.requestedAttack;
      entity.combat.execute(attackKey);
    },

    update(entity) {
      // 🔒 stay here until combat finishes
      if (!entity.isAttacking && !entity.isDead) {
        entity.state.setState("idle");
      }
    },
  },

  hit: {
    enter(entity, data) {
      entity.isInvincible = true;
      entity.isAttacking = false;

      const body = entity.bodyLayer.body;
      body.setVelocity(0, 0);
      body.setAcceleration(0, 0);
      body.setDrag(1000, 1000);

      entity.visual.play(`${entity.key}_take-hit`);

      const baseStun = 300;
      const stun = entity.hitStunMultiplier
        ? baseStun * entity.hitStunMultiplier
        : baseStun;

      entity.scene.time.delayedCall(stun, () => {
        if (!entity.isDead) entity.state.setState("idle");
      });
    },
    update() {},
    exit(entity) {
      entity.isInvincible = false;
      const body = entity.bodyLayer.body;
      body.setDrag(0, 0);
      body.setAcceleration(0, 0);
    },
  },

  dead: {
    enter(entity) {
      entity.isDead = true;
      entity.isInvincible = true;

      const body = entity.bodyLayer.body;
      body.setVelocity(0, 0);
      body.setAcceleration(0, 0);
      body.setAllowGravity(false);
      body.moves = false;

      if (entity.healthBar) entity.healthBar.destroy();

      const animKey = `${entity.key}_defeated`;
      entity.visual.play(animKey);
      entity.visual.onAnimComplete(animKey, () => {
        entity.onDeathAnimationComplete?.();
      });

      if (entity._activeHitboxes) {
        for (const hb of entity._activeHitboxes) {
          if (hb.active) hb.destroy();
        }
        entity._activeHitboxes.clear();
      }
    },
    update() {},
  },
};
