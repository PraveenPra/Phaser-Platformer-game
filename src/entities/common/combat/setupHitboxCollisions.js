import { spawnImpactVFX } from "../vfx/spawnImpactVFX.js";
import { doHitStop } from "../vfx/doHitStop.js";
import { StatusEffectApplier } from "/src/entities/common/status/StatusEffectApplier.js";
import { createDamagePacket } from "/src/combat/DamageTypes.js";

export function setupHitboxCollisions(scene, hitbox, targets, options = {}) {
  const { destroyOnHit = false } = options;

  scene.physics.add.overlap(hitbox, targets, (hb, target) => {
    if (!target || !target.receiveDamage) return;

    // never hit yourself
    if (target === hb.owner) return;

    // prevent repeated hits
    if (hb._hitTargets?.has(target)) return;
    hb._hitTargets?.add(target);

    // =========================
    // DAMAGE (AUTHORITATIVE)
    // =========================
    const damagePacket = createDamagePacket({
      amount: hb.damage,
      source: hb.owner,
      attack: hb.attack ?? null,
      hitReaction: hb.hitReaction,
      type: hb.owner.role === "player" ? "player-attack" : "enemy-attack",
      flags: hb.flags,
    });

    const result = target.receiveDamage(damagePacket);

    if (!result?.applied) {
      return;
    }

    // ONLY after confirmed damage:
    // =========================
    // HIT CONFIRM FEEDBACK
    // =========================
    const hitStopMs = hb.hitStop ?? Math.min(80, 30 + hb.damage * 2);
    doHitStop(scene, hitStopMs);

    scene.sound.play("sfx-blast-hit", {
      volume: hb.owner.role === "player" ? 0.7 : 0.4,
      rate: Phaser.Math.FloatBetween(0.95, 1.05),
    });

    spawnImpactVFX(scene, target.x, target.y, {
      type: hb.impactVFX || "impact-hit",
      damage: hb.damage,
      sourceRole: hb.owner.role,
    });

    // =========================
    // STATUS EFFECTS (AFTER HIT)
    // =========================
    if (hb.statusEffect) {
      StatusEffectApplier.apply(target, hb.statusEffect);
    }

    if (destroyOnHit) {
      hb.destroy();
    }
  });
}
