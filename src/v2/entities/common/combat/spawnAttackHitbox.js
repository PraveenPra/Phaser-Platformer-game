export function spawnAttackHitbox(scene, owner, config) {
  const dir = owner.visual.sprite.flipX ? -1 : 1;

  const hitbox = scene.physics.add.sprite(
    owner.x + config.offsetX * dir,
    owner.y + config.offsetY,
    null
  );

  hitbox.body.setSize(config.width, config.height);
  hitbox.body.allowGravity = false;
  hitbox.setVisible(false);

  scene.time.delayedCall(config.duration, () => {
    hitbox.destroy();
  });

  return hitbox;
}
