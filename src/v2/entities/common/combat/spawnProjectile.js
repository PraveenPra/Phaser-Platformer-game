export function spawnProjectile(scene, owner, attack) {
  const dir = owner.visual.sprite.flipX ? -1 : 1;

  const p = scene.physics.add.sprite(
    owner.x + attack.projectile.offsetX * dir,
    owner.y + attack.projectile.offsetY,
    "big-fireball"
  );

  p.body.allowGravity = false;
  p.setVelocityX(attack.projectile.speed * dir);
  p.damage = attack.damage;
  p.owner = owner;

  scene.time.delayedCall(attack.projectile.lifetime, () => {
    if (p.active) p.destroy();
  });

  return p;
}
