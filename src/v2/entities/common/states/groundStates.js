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

      // const fireFrame = attack.fireFrame ?? null;

      // if (fireFrame !== null) {
      //   // entity.visual.sprite.on(
      //   //   Phaser.Animations.Events.ANIMATION_UPDATE,
      //   //   function (anim, frame) {
      //   //     if (frame.index === fireFrame) {
      //   //       if (attack.type === "melee") {
      //   //         spawnAttackHitbox(entity.scene, entity, attack.hitbox);
      //   //       }

      //   //       if (attack.type === "projectile") {
      //   //         spawnProjectile(entity.scene, entity, attack);
      //   //       }

      //   //       this.off(Phaser.Animations.Events.ANIMATION_UPDATE);
      //   //     }
      //   //   }
      //   // );

      //   const onUpdate = (anim, frame) => {
      //     if (anim.key !== animKey) return;
      //     if (frame.index !== fireFrame) return;

      //     if (attack.type === "melee") {
      //       spawnAttackHitbox(entity.scene, entity, attack.hitbox);
      //     }

      //     if (attack.type === "projectile") {
      //       spawnProjectile(entity.scene, entity, attack);
      //     }

      //     sprite.off(Phaser.Animations.Events.ANIMATION_UPDATE, onUpdate);
      //   };

      //   sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, onUpdate);
      // }

      const fireFrame = attack.fireFrame ?? null;

      // 🔥 MELEE: spawn immediately if no fireFrame
      if (attack.type === "melee" && fireFrame === null) {
        spawnAttackHitbox(entity.scene, entity, attack.hitbox);
      }

      // 🔥 FRAME-BASED attacks (projectile OR melee with fireFrame)
      if (fireFrame !== null) {
        const onUpdate = (anim, frame) => {
          if (anim.key !== animKey) return;
          if (frame.index !== fireFrame) return;

          if (attack.type === "melee") {
            spawnAttackHitbox(entity.scene, entity, attack.hitbox);
          }

          if (attack.type === "projectile") {
            spawnProjectile(entity.scene, entity, attack);
          }

          sprite.off(Phaser.Animations.Events.ANIMATION_UPDATE, onUpdate);
        };

        sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, onUpdate);
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
