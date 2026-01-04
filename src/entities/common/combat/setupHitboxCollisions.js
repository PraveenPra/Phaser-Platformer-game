export function setupHitboxCollisions(scene, hitbox, targets) {
  scene.physics.add.overlap(hitbox, targets, (hb, target) => {
    if (!target.active) return;
    if (target === hb.owner) return;

    // 🔒 already hit during this attack window
    if (hb.hitTargets.has(target)) return;

    hb.hitTargets.add(target);

    if (typeof target.takeDamage === "function") {
      target.takeDamage(hb.damage, hb.owner);
      console.log(
        `[HIT CONFIRMED] ${hb.owner.key} → ${target.key} (${hb.damage})`
      );
    }
  });
}
