export function spawnImpactVFX(scene, x, y, type = "default", hbDamage = 0) {
  const vfx = scene.add.sprite(x, y, `impact_${type}`);
  const scale = Phaser.Math.Clamp(hbDamage / 10, 1, 2.2);
  vfx.setScale(scale);

  vfx.play("impact-hit");

  //use only on heavy attacks, boss, skillLevel2-3
  scene.cameras.main.shake(80, 0.004);

  vfx.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
    vfx.destroy();
  });
}
