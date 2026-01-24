export function playFreezeFlash(sprite, duration = 120) {
  // freeze animation only
  const prevAnim = sprite.anims.currentAnim?.key;
  sprite.anims.pause();

  // white flash
  sprite.setTintFill(0xffffff);

  sprite.scene.time.delayedCall(duration, () => {
    sprite.clearTint();
    if (prevAnim) {
      sprite.anims.resume();
    }
  });
}
