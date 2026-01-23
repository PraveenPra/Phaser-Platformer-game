let isHitStopping = false;

export function doHitStop(scene, duration = 60) {
  if (isHitStopping) return;
  isHitStopping = true;

  // Pause physics
  scene.physics.world.pause();

  // Pause ALL animations safely
  scene.anims.pauseAll();

  scene.time.delayedCall(duration, () => {
    scene.physics.world.resume();
    scene.anims.resumeAll();
    isHitStopping = false;
  });
}
