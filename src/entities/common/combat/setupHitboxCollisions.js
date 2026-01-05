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
      `[HIT CONFIRMED] ${hb.owner.key} → ${target.key} (${hb.damage})`
    );

    target.takeDamage(hb.damage, hb.owner);

    if (destroyOnHit) {
      hb.destroy();
    }
  });
}
