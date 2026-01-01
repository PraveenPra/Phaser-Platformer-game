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

  p.damage = attack.damage;
  p.owner = owner;

  scene.time.delayedCall(proj.lifetime, () => {
    if (p.active) p.destroy();
  });

  return p;
}
