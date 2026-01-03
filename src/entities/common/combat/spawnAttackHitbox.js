export function spawnAttackHitbox(scene, owner, config) {
  const dir = owner.visual.sprite.flipX ? -1 : 1;

  const hitbox = scene.physics.add.sprite(
    owner.x + config.offsetX * dir,
    owner.y + config.offsetY,
    "__hitbox"
  );

  hitbox.setTint(0xff0000); // melee = red

  hitbox.body.setSize(config.width, config.height);
  hitbox.body.allowGravity = false;

  // dev visibility toggle
  hitbox.setVisible(true);
  hitbox.setAlpha(0.4);

  if (config.duration) {
    scene.time.delayedCall(config.duration, () => {
      if (hitbox.active) hitbox.destroy();
    });
  }

  return hitbox;
}
