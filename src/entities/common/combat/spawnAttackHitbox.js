export function spawnAttackHitbox(scene, owner, config) {
  const dir = owner.visual.sprite.flipX ? -1 : 1;

  const hitbox = scene.physics.add.sprite(
    owner.x + config.offsetX * dir,
    owner.y + config.offsetY,
    "__hitbox"
  );

  hitbox.setTint(0xff0000);
  hitbox.setAlpha(0.4);

  hitbox.body.setSize(config.width, config.height);
  hitbox.body.allowGravity = false;
  hitbox.setVisible(true);

  // ownership & damage
  hitbox.owner = owner;
  hitbox.damage = config.damage;
  hitbox.hitTargets = new Set(); // 🔒 per-attack damage control

  console.log(`[HITBOX SPAWN] owner=${owner.key} dmg=${hitbox.damage}`);

  //destroy hitboxes if the character dies
  owner._activeHitboxes ??= new Set();
  owner._activeHitboxes.add(hitbox);

  hitbox.once("destroy", () => {
    owner._activeHitboxes?.delete(hitbox);
  });

  return hitbox;
}
