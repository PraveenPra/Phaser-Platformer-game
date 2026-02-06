import { spawnImpactVFX } from "../vfx/spawnImpactVFX.js";
import { doHitStop } from "../vfx/doHitStop.js";
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
      volume: hb.owner.role === "player" ? 0.7 : 0.4,
      rate: Phaser.Math.FloatBetween(0.95, 1.05),
    });
    console.warn("hitbox", hb);
    spawnImpactVFX(scene, target.x, target.y, {
      type: hb.impactVFX || "impact-hit",
      damage: hb.damage,
      sourceRole: hb.owner.role, // 🔑 THIS IS THE KEY
    });

    // 🎯 APPLY DAMAGE LAST
    target.takeDamage({
      amount: hb.damage,
      source: hb.owner,
      hitbox: hb,
      hitReaction: hb.hitReaction,
      type: hb.owner.role === "player" ? "player-attack" : "enemy-attack",
    });

    // target.hitReaction.handleHit({
    //   reaction: hit.reaction, // or "light" for now
    //   force: hit.force, // whatever you already pass
    // });

    if (destroyOnHit) {
      hb.destroy();
    }
  });
}
