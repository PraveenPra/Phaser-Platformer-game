import { spawnAttackHitbox } from "../entities/common/combat/spawnAttackHitbox.js";
import { spawnProjectile } from "../entities/common/combat/spawnProjectile.js";
import { setupHitboxCollisions } from "../entities/common/combat/setupHitboxCollisions.js";
import { spawnBeam } from "/src/combat/beam/spawnBeam.js";

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

    // =========================
    // 🔒 ROLE-BASED ATTACK PERMISSION
    // =========================
    if (entity.type === "enemy") {
      const allowed = entity.archetype?.allowedAttacks;

      if (!allowed || !allowed.includes(attackKey)) {
        // Block forbidden attack
        entity.isAttacking = false;
        entity.requestedAttack = null;
        return;
      }
    }
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
    // BEAM
    // ===============================
    if (attack.beam) {
      spawnBeam(entity.scene, entity, attack);
    }

    // ===============================
    // PROJECTILE
    // ===============================
    if (attack.type === "projectile" && attack.fireFrame !== undefined) {
      const fireFrame = attack.fireFrame;

      const onUpdate = (anim, frame) => {
        if (anim.key !== animKey) return;
        if (frame.index !== fireFrame) return;

        if (attack.projectile) {
          spawnProjectile(entity.scene, entity, attack);
        }

        sprite.off(Phaser.Animations.Events.ANIMATION_UPDATE, onUpdate);
      };

      sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, onUpdate);
    }

    // ===============================
    // CLEANUP
    // ===============================
    if (!attack.beam) {
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

  // for beam attacks
  finishAttack() {
    const entity = this.entity;

    entity.isAttacking = false;

    if (entity.currentAttackKey) {
      const attack = entity.profile.attacks[entity.currentAttackKey];

      if (attack) {
        entity.startCooldown(entity.currentAttackKey, attack.cooldown);
      }
    }

    entity.currentAttackKey = null;
  }
}
