import { spawnAttackHitbox } from "../combat/spawnAttackHitbox.js";
import { spawnProjectile } from "../combat/spawnProjectile.js";
import { setupHitboxCollisions } from "../combat/setupHitboxCollisions.js";

export const GroundStates = {
  idle: {
    enter(entity) {
      entity.visual.play(`${entity.key}_idle`);
      entity.bodyLayer.body.setVelocityX(0);
    },

    update(entity) {
      if (entity.isDead || entity.state.current === "hit") return;

      if (entity.input?.left || entity.input?.right) {
        entity.state.setState("run");
      }
      if (entity.input?.jump && entity.bodyLayer.body.onFloor()) {
        entity.state.setState("jump");
      }
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
  },

  run: {
    enter(entity) {
      entity.visual.play(`${entity.key}_run`);
    },

    update(entity) {
      if (entity.isDead || entity.state.current === "hit") return;

      const body = entity.bodyLayer.body;
      const speed = entity.profile.move.speed;

      if (entity.input?.left) {
        body.setVelocityX(-speed);
        entity.visual.flip(true);
      } else if (entity.input?.right) {
        body.setVelocityX(speed);
        entity.visual.flip(false);
      } else {
        entity.state.setState("idle");
      }

      if (entity.input?.jump && body.onFloor()) {
        entity.state.setState("jump");
      }

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
  },

  jump: {
    enter(entity) {
      entity.visual.play(`${entity.key}_jump`);
      entity.bodyLayer.body.setVelocityY(-entity.profile.move.jump);
    },

    update(entity) {
      const body = entity.bodyLayer.body;
      const speed = entity.profile.move.speed;

      // ===== AIR CONTROL =====
      if (entity.input?.left) {
        body.setVelocityX(-speed);
        entity.visual.flip(true);
      } else if (entity.input?.right) {
        body.setVelocityX(speed);
        entity.visual.flip(false);
      }

      // ===== LAND =====
      if (body.onFloor()) {
        entity.state.setState("idle");
      }
    },
  },

  attack: {
    enter(entity) {
      const attackKey = entity.requestedAttack;
      entity.combat.execute(attackKey);
    },
    update() {},
  },

  hit: {
    enter(entity, data) {
      entity.isInvincible = true;
      entity.isAttacking = false;

      const body = entity.bodyLayer.body;
      body.setVelocity(0, 0);
      body.setAcceleration(0, 0);
      body.setDrag(1000, 0);

      entity.visual.play(`${entity.key}_take-hit`);

      const baseStun = 300;
      const stun = entity.hitStunMultiplier
        ? baseStun * entity.hitStunMultiplier
        : baseStun;

      entity.scene.time.delayedCall(stun, () => {
        if (!entity.isDead) {
          entity.state.setState("idle");
        }
      });
    },

    update() {},

    exit(entity) {
      entity.isInvincible = false;
      entity.bodyLayer.body.setDrag(0, 0);
    },
  },

  dead: {
    enter(entity) {
      entity.isDead = true;
      entity.isInvincible = true;

      const body = entity.bodyLayer.body;

      body.setVelocity(0, 0);
      body.setAcceleration(0, 0);

      // ✅ stop gravity instead of disabling collision
      body.setAllowGravity(false);

      // ✅ freeze in place
      body.moves = false;

      if (entity.healthBar) {
        entity.healthBar.destroy();
      }

      const animKey = `${entity.key}_defeated`;

      entity.visual.play(animKey);

      // 🔥 notify entity when death animation ends
      entity.visual.onAnimComplete(animKey, () => {
        entity.onDeathAnimationComplete?.();
      });

      // 💣 destroy any leftover hitboxes
      if (entity._activeHitboxes) {
        for (const hb of entity._activeHitboxes) {
          if (hb.active) hb.destroy();
        }
        entity._activeHitboxes.clear();
      }
    },

    update(entity) {
      // nothing — terminal state
    },
  },
};
