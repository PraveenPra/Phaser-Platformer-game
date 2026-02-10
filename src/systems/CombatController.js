import { spawnAttackHitbox } from "../entities/common/combat/spawnAttackHitbox.js";
import { spawnProjectile } from "../entities/common/combat/spawnProjectile.js";
import { setupHitboxCollisions } from "../entities/common/combat/setupHitboxCollisions.js";

export class CombatController {
  constructor(entity) {
    this.entity = entity;
  }

  requestAttack(attackKey) {
    this.requestedAttack = attackKey;
  }

  canAttack(attackKey) {
    return this.entity.canAttack(attackKey);
  }

  execute(attackKey) {
    const entity = this.entity;
    const attack = entity.profile.attacks?.[attackKey];

    if (!attack || !this.canAttack(attackKey)) {
      entity.isAttacking = false;
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
    // MELEE
    // ===============================
    if (attack.type === "melee" && attack.fireFrames?.length) {
      let activeHitbox = null;
      const fireFrames = new Set(attack.fireFrames);

      const onUpdate = (anim, frame) => {
        if (anim.key !== animKey) return;

        const inWindow = fireFrames.has(frame.index);

        if (inWindow && !activeHitbox) {
          activeHitbox = spawnAttackHitbox(entity.scene, entity, {
            ...attack.hitbox,
            damage: entity.getOutgoingDamage(attack),
          });

          setupHitboxCollisions(
            entity.scene,
            activeHitbox,
            entity.getAttackTargets(entity.scene),
          );
        }

        if (!inWindow && activeHitbox) {
          activeHitbox.destroy();
          activeHitbox = null;
        }
      };

      sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, onUpdate);

      sprite.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + animKey,
        () => {
          if (activeHitbox) activeHitbox.destroy();
          sprite.off(Phaser.Animations.Events.ANIMATION_UPDATE, onUpdate);
        },
      );
    }

    // ===============================
    // PROJECTILE
    // ===============================
    if (attack.type === "projectile" && attack.fireFrame !== undefined) {
      const fireFrame = attack.fireFrame;

      const onUpdate = (anim, frame) => {
        if (anim.key !== animKey) return;
        if (frame.index !== fireFrame) return;

        spawnProjectile(entity.scene, entity, attack);
        sprite.off(Phaser.Animations.Events.ANIMATION_UPDATE, onUpdate);
      };

      sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, onUpdate);
    }

    // ===============================
    // CLEANUP
    // ===============================
    sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + animKey,
      () => {
        entity.isAttacking = false;
        entity.startCooldown(attackKey, attack.cooldown);

        if (entity.role === "enemy" && entity.ai) {
          entity.ai.postAttackTimer = entity.ai.postAttackPause;
        }
      },
    );
  }
}
