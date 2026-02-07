import { IMPACT_PROFILES } from "./ImpactProfiles.js";
import { doHitStop } from "./doHitStop.js";

export function spawnImpactVFX(
  scene,
  x,
  y,
  { type = "impact-hit", damage = 0, sourceRole = "player" },
) {
  const profile = IMPACT_PROFILES[sourceRole] ?? IMPACT_PROFILES.player;
  const vfx = scene.add.sprite(x, y, type);

  const baseScale = Phaser.Math.Clamp(damage / 10, 1, 2.2);
  vfx.setScale(baseScale * profile.scaleMultiplier);

  vfx.play(type);

  // Camera shake (controlled)
  if (profile.cameraShake) {
    scene.cameras.main.shake(
      profile.cameraShake.duration,
      profile.cameraShake.intensity,
    );
  }

  // Hit stop (short & safe)
  if (profile.hitStop) {
    doHitStop(scene, profile.hitStop);
  }

  vfx.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
    vfx.destroy();
  });
}
