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
      if (entity.isDead || entity.state.current === "hit") return;

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
        let activeHitbox = null;
        const fireFrames = new Set(attack.fireFrames);

        const onMeleeUpdate = (anim, frame) => {
          if (anim.key !== animKey) return;

          const inWindow = fireFrames.has(frame.index);

          // ▶ ENTER hit window
          if (inWindow && !activeHitbox) {
            activeHitbox = spawnAttackHitbox(entity.scene, entity, {
              ...attack.hitbox,
              damage: attack.damage,
            });

            // wire collision ONCE
            setupHitboxCollisions(
              entity.scene,
              activeHitbox,
              entity.getAttackTargets(entity.scene)
            );
          }

          // ⏹ EXIT hit window
          if (!inWindow && activeHitbox) {
            activeHitbox.destroy();
            activeHitbox = null;
          }
        };

        sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, onMeleeUpdate);

        sprite.once(
          Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + animKey,
          () => {
            if (activeHitbox) {
              activeHitbox.destroy();
              activeHitbox = null;
            }
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

  hit: {
    enter(entity, data) {
      console.log(`[STATE] ${entity.key} → HIT`);

      entity.isInvincible = true;
      entity.isAttacking = false;

      // stop movement
      entity.bodyLayer.body.setVelocity(0, 0);
      entity.bodyLayer.body.setAcceleration(0, 0);
      entity.bodyLayer.body.setDrag(1000, 0);

      // optional knockback
      // if (data?.source?.x !== undefined) {
      //   const dir = entity.x < data.source.x ? -1 : 1;
      //   entity.bodyLayer.body.setVelocityX(80 * dir);
      // }
      console.log(entity.scene.anims.exists(`${entity.key}_take-hit`));

      // play hit animation
      entity.visual.play(`${entity.key}_take-hit`);

      entity.visual.onAnimComplete(`${entity.key}_take-hit`, () => {
        if (!entity.isDead) {
          console.log(`[STATE] ${entity.key} HIT → IDLE`);
          entity.state.setState("idle");
        }
      });
    },

    update(entity) {
      // do nothing — locked state
    },

    exit(entity) {
      entity.isInvincible = false;
      entity.bodyLayer.body.setDrag(0, 0);
    },
  },
  dead: {
    enter(entity) {
      entity.isDead = true;
      entity.isInvincible = true;

      entity.bodyLayer.body.setVelocity(0, 0);

      // disable physics impulses
      entity.bodyLayer.body.checkCollision.none = true;

      entity.visual.play(`${entity.key}_defeated`);
    },

    update(entity) {
      // nothing — terminal state
    },
  },
};
