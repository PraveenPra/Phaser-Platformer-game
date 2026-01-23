export function doHitFlash(sprite, duration = 80) {
  if (!sprite || !sprite.active) return;

  if (sprite._isHitFlashing) return;
  sprite._isHitFlashing = true;

  // WHITE FLASH
  sprite.setTintFill(0xffffff);

  sprite.scene.time.delayedCall(duration, () => {
    if (!sprite.active) return;

    sprite.clearTint(); // ✅ THIS IS CORRECT FOR phaser3.88
    sprite._isHitFlashing = false;
  });
}
