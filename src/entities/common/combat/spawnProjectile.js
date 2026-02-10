import { setupHitboxCollisions } from "./setupHitboxCollisions.js";

export function spawnProjectile(scene, owner, attack) {
  const dir = owner.visual.sprite.flipX ? -1 : 1;
  const proj = attack.projectile;

  const p = scene.physics.add.sprite(
    owner.x + proj.offsetX * dir,
    owner.y + proj.offsetY,
    proj.texture,
  );

  if (proj.scale !== undefined) {
    p.setScale(proj.scale);
  }

  p.body.allowGravity = false;
  p.setVelocityX(proj.speed * dir);

  if (proj.anim) {
    p.play(proj.anim);
  }

  // =========================
  // Combat metadata (same as hitbox)
  // =========================
  p.damage = owner.getOutgoingDamage(attack);
  p.owner = owner;
  p.hitStop = attack.hitStop;
  // Reactions
  p.hitReaction = attack.projectile.hitReaction ?? "flinch";

  // Status Effects(burn,freeze)
  p.statusEffect = attack.projectile.statusEffect ?? null;

  const currentAttackKey = owner?.currentAttackKey || null;

  p.impactVFX =
    owner?.profile?.attacks[currentAttackKey]?.impactVFX || "vfx-fireblast";
  // p.impactVFX = attack.impactVFX || "vfx-fireblast";

  p._hitTargets = new Set(); // prevent multi-hit

  // =========================
  // Collision → damage
  // =========================
  setupHitboxCollisions(scene, p, owner.getAttackTargets(scene), {
    destroyOnHit: true, // projectiles vanish on hit
  });

  // =========================
  // Lifetime cleanup
  // =========================
  scene.time.delayedCall(proj.lifetime, () => {
    if (p.active) p.destroy();
  });

  return p;
}
