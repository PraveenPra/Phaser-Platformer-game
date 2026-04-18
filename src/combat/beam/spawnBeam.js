import { createDamagePacket } from "/src/combat/DamageTypes.js";
import { ReactionResolver } from "/src/combat/ReactionResolver.js";
import { StatusEffectApplier } from "/src/entities/common/status/StatusEffectApplier.js";
import { spawnImpactVFX } from "/src/entities/common/vfx/spawnImpactVFX.js";
import { doHitStop } from "/src/entities/common/vfx/doHitStop.js";

export function spawnBeam(scene, owner, attack) {
  const beam = {};
  const beamData = attack.beam;

  beam.owner = owner;
  beam.attack = attack;
  beam.damage = owner.getOutgoingDamage(attack);

  beam.range = beamData.range ?? 140;
  beam.width = beamData.width ?? 48;
  beam.tickRate = beamData.tickRate ?? 120;
  beam.duration = beamData.duration ?? 600;
  beam.pushForce = beamData.pushForce ?? 0;

  beam.hitTargets = new Set();

  // visual sprite (middle stream)
  beam.visual = scene.add.tileSprite(
    owner.x,
    owner.y,
    beam.range,
    beam.width,
    beamData.texture,
  );

  beam.visual.setOrigin(0, 0.5);

  beam.muzzle = scene.add.sprite(
    owner.x + beamData.offsetX + 25,
    owner.y + beamData.offsetY,
    "vfx-watergun-muzzle",
  );
  beam.muzzle.play("vfx-watergun-muzzle");

  beam.update = function () {
    const dir = owner.visual.sprite.flipX ? -1 : 1;

    const x = owner.x + beamData.offsetX * dir;
    const y = owner.y + beamData.offsetY;

    beam.visual.x = x;
    beam.visual.y = y;

    beam.visual.tilePositionX += 5 * -dir;

    beam.visual.scaleX = dir;
  };

  // =========================
  // DAMAGE TICK LOOP
  // =========================
  beam.timer = scene.time.addEvent({
    delay: beam.tickRate,
    loop: true,
    callback: () => {
      const dir = owner.visual.sprite.flipX ? -1 : 1;

      const rectX = owner.x + beamData.offsetX * dir;
      const rectY = owner.y + beamData.offsetY - beam.width / 2;

      const rect = new Phaser.Geom.Rectangle(
        dir === 1 ? rectX : rectX - beam.range,
        rectY,
        beam.range,
        beam.width,
      );

      const targets = owner.getAttackTargets(scene);

      targets.children.iterate((target) => {
        if (!target || !target.active || !target.receiveDamage) return;
        if (target === owner) return;
        const targetBody = target.body;
        const targetRect = targetBody
          ? new Phaser.Geom.Rectangle(
              targetBody.x,
              targetBody.y,
              targetBody.width,
              targetBody.height,
            )
          : new Phaser.Geom.Rectangle(target.x, target.y, 1, 1);

        if (!Phaser.Geom.Intersects.RectangleToRectangle(rect, targetRect)) {
          return;
        }

        const damagePacket = createDamagePacket({
          amount: beam.damage,
          source: owner,
          attack: attack,
          type: owner.role === "player" ? "player-attack" : "enemy-attack",
        });

        const result = target.receiveDamage(damagePacket);
        if (!result?.applied) return;

        doHitStop(scene, 40);

        spawnImpactVFX(scene, target.x, target.y, {
          type: beamData.impactVFX ?? "vfx-watergun-impact",
          damage: beam.damage,
          sourceRole: owner.role,
        });

        if (beam.pushForce !== 0 && target.body) {
          target.body.velocity.x += dir * beam.pushForce;
        }

        if (beamData.statusEffect) {
          const mult = ReactionResolver.getStatusMultiplier(
            target,
            beamData.statusEffect,
          );

          if (mult > 0) {
            StatusEffectApplier.apply(target, beamData.statusEffect, {
              durationMultiplier: mult,
            });
          }
        }
      });
    },
  });

  // =========================
  // UPDATE LOOP
  // =========================
  scene.events.on("update", beam.update);

  // =========================
  // AUTO DESTROY
  // =========================
  scene.time.delayedCall(beam.duration, () => {
    scene.events.off("update", beam.update);
    beam.timer.remove(false);
    beam.visual.destroy();
    beam.muzzle.destroy();
    // release attack lock
    if (beam.owner.combat) {
      beam.owner.combat.finishAttack();
    }
  });

  return beam;
}
