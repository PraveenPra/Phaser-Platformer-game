import { setupHitboxCollisions } from "./setupHitboxCollisions.js";

export function spawnProjectile(scene, owner, attack) {
  const dir = owner.visual.sprite.flipX ? -1 : 1;
  const proj = attack.projectile;

  const p = scene.physics.add.sprite(
    owner.x + proj.offsetX * dir,
    owner.y + proj.offsetY,
    proj.texture
  );

  p.body.allowGravity = false;
  p.setVelocityX(proj.speed * dir);

  if (proj.anim) {
    p.play(proj.anim);
  }

  // =========================
  // Combat metadata (same as hitbox)
  // =========================
  p.damage = attack.damage;
  p.owner = owner;
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
