import { spawnAttackHitbox } from "../combat/spawnAttackHitbox.js";
import { spawnProjectile } from "../combat/spawnProjectile.js";
import { setupHitboxCollisions } from "../combat/setupHitboxCollisions.js";

export const GroundStates = {
  idle: {
    enter(entity) {
      const body = entity.bodyLayer.body;
      const move = entity.profile.move;

      // ✅ ground physics
      body.setAllowGravity(true);
      body.setDragX(move.decel);
      body.setAccelerationX(0);

      entity.visual.play(`${entity.key}_idle`);
      entity.movement.stop();
    },

    update(entity) {
      if (entity.isDead || entity.state.current === "hit") return;

      if (entity.input?.left || entity.input?.right) {
        entity.state.setState("run");
      }

      if (entity.input?.jump) {
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
      const body = entity.bodyLayer.body;
      const move = entity.profile.move;

      // ✅ ground physics
      body.setAllowGravity(true);
      body.setDragX(0); // no drag while actively moving

      entity.visual.play(`${entity.key}_run`);
    },

    update(entity) {
      if (entity.isDead || entity.state.current === "hit") return;

      if (entity.input?.left) {
        entity.movement.moveHorizontal(-1);
      } else if (entity.input?.right) {
        entity.movement.moveHorizontal(1);
      } else {
        entity.state.setState("idle");
      }

      if (entity.input?.jump) {
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
      const body = entity.bodyLayer.body;

      // airborne now
      body.setDragX(0);

      entity.visual.play(`${entity.key}_jump`);
      entity.movement.jump();

      // If multi-domain, switch movement AND FSM state to fly
      if (
        entity.profile.movement?.mode === "multi-domain" &&
        entity.profile.movement.domains.includes("air")
      ) {
        entity.movement.switchDomain("air"); // switch to air movement
        entity.state.setState("fly"); // switch FSM to AirStates.fly
        return; // exit enter to prevent jump logic from continuing
      }
    },

    update(entity) {
      // Landing
      if (entity.bodyLayer.body.onFloor()) {
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
