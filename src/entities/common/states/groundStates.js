import { spawnAttackHitbox } from "../combat/spawnAttackHitbox.js";
import { spawnProjectile } from "../combat/spawnProjectile.js";

export const GroundStates = {
  idle: {
    enter(entity) {
      entity.visual.play(`${entity.key}_idle`);
      entity.bodyLayer.body.setVelocityX(0);
    },

    update(entity) {
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
      if (entity.bodyLayer.body.onFloor()) {
        entity.state.setState("idle");
      }
    },
  },

  attack: {
    enter(entity) {
      const attackKey = entity.requestedAttack;
      const attack = entity.profile.attacks?.[attackKey];

      if (!attack || !entity.canAttack(attackKey)) {
        entity.state.setState("idle");
        return;
      }

      entity.currentAttackKey = attackKey;
      entity.requestedAttack = null;

      entity.isAttacking = true;
      entity.bodyLayer.body.setVelocityX(0);

      const sprite = entity.visual.sprite;

      const animKey = `${entity.key}_${attack.anim}`;
      entity.visual.play(animKey);

      // ===============================
      // MELEE: multi-frame hit windows
      // ===============================
      if (attack.type === "melee" && attack.fireFrames?.length) {
        const firedFrames = new Set();

        const onMeleeUpdate = (anim, frame) => {
          if (anim.key !== animKey) return;
          if (!attack.fireFrames.includes(frame.index)) return;
          if (firedFrames.has(frame.index)) return;

          firedFrames.add(frame.index);
          spawnAttackHitbox(entity.scene, entity, attack.hitbox);
        };

        sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, onMeleeUpdate);

        sprite.once(
          Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + animKey,
          () => {
            sprite.off(
              Phaser.Animations.Events.ANIMATION_UPDATE,
              onMeleeUpdate
            );
          }
        );
      }

      // =================================
      // PROJECTILE: single fire frame ONLY
      // =================================
      if (attack.type === "projectile" && attack.fireFrame !== undefined) {
        const fireFrame = attack.fireFrame;

        const onProjectileUpdate = (anim, frame) => {
          if (anim.key !== animKey) return;
          if (frame.index !== fireFrame) return;

          spawnProjectile(entity.scene, entity, attack);

          sprite.off(
            Phaser.Animations.Events.ANIMATION_UPDATE,
            onProjectileUpdate
          );
        };

        sprite.on(
          Phaser.Animations.Events.ANIMATION_UPDATE,
          onProjectileUpdate
        );
      }

      entity.visual.sprite.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + animKey,
        () => {
          entity.isAttacking = false;
          entity.startCooldown(attackKey, attack.cooldown);
          entity.state.setState("idle");
        }
      );
    },

    update(entity) {},
  },
};
