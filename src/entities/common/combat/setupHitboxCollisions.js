import { spawnImpactVFX } from "../vfx/spawnImpactVFX.js";
import { doHitStop } from "/src/systems/HitStop.js";
export function setupHitboxCollisions(scene, hitbox, targets, options = {}) {
  const { destroyOnHit = false } = options;

  scene.physics.add.overlap(hitbox, targets, (hb, target) => {
    if (!target || !target.takeDamage) return;

    // never hit yourself
    if (target === hb.owner) return;

    if (target.isDead || target.isInvincible) return;

    // prevent repeated hits
    if (hb._hitTargets?.has(target)) return;
    hb._hitTargets?.add(target);

    console.log(
      `[HIT CONFIRMED] ${hb.owner.key} → ${target.key} (${hb.damage})`,
    );

    // =========================
    // HIT CONFIRM FEEDBACK
    // =========================
    const hitStopMs = hb.hitStop ?? Math.min(80, 30 + hb.damage * 2);
    doHitStop(scene, hitStopMs);

    // 🔊 IMPACT SOUND
    scene.sound.play("sfx-blast-hit", {
      volume: 0.6,
      rate: Phaser.Math.FloatBetween(0.95, 1.05),
    });

    // 💥 IMPACT VFX
    // spawnImpactVFX(
    //   scene,
    //   target.x,
    //   target.y,
    //   hb.impactVFX || "default",
    //   hb.damage,
    // );

    // 🎯 APPLY DAMAGE LAST
    target.takeDamage(hb.damage, hb.owner);

    if (destroyOnHit) {
      hb.destroy();
    }
  });
}
