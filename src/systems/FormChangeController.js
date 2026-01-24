import { resolveProfile } from "/src/entities/digimon/resolveProfile.js";
import { GameState } from "/src/GameState.js";

/**
 * @param {object} params
 * @param {Phaser.Scene} params.scene
 * @param {Character} params.entity
 * @param {string} params.targetKey
 * @param {"switch" | "evolution"} params.reason
 */
export function changeForm({ scene, entity, targetKey, reason = "switch" }) {
  if (!scene || !entity || !targetKey) return;
  if (entity.isDead || entity.state?.current === "dead") return;
  if (entity._isChangingForm) return;

  // =================================================
  // VALIDATION
  // =================================================
  if (reason === "switch") {
    if (!GameState.unlockedBaseForms?.has(targetKey)) return;
  }

  if (reason === "evolution") {
    const next = entity.profile.evolution?.next;
    if (next !== targetKey) return;
    if (!GameState.unlockedEvolutions?.has(targetKey)) return;
  }

  entity._isChangingForm = true;

  // =================================================
  // SNAPSHOT RUNTIME STATE (SAFE ONLY)
  // =================================================
  const snapshot = {
    x: entity.x,
    y: entity.y,
    flipX: entity.visual.sprite.flipX,
    hpRatio: entity.currentHp / entity.profile.combat.maxHp,
    wasInAir:
      entity.movement?.activeDomain === "air" ||
      entity.bodyLayer.body.velocity.y !== 0,
  };

  // =================================================
  // PLAY SFX
  // =================================================
  scene.sound.play(reason === "evolution" ? "sfx-evolution" : "sfx-blast-hit", {
    volume: reason === "evolution" ? 0.9 : 0.6,
    rate: Phaser.Math.FloatBetween(0.95, 1.05),
  });

  // =================================================
  // PLAY VFX (impact-hit)
  // =================================================
  const vfx = scene.add.sprite(snapshot.x, snapshot.y, "impact-hit");
  vfx.setDepth(9999);
  vfx.play("impact-hit");

  vfx.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => vfx.destroy());

  // =================================================
  // DELAY → FORM SWAP
  // =================================================
  const delay = reason === "evolution" ? 700 : 250;

  scene.time.delayedCall(delay, () => {
    // destroy old entity AFTER VFX
    entity.destroy();

    // spawn new via scene (CRITICAL)
    const newEntity = scene.spawnPlayer(snapshot.x, snapshot.y, targetKey);

    if (!newEntity) return;

    // restore facing
    newEntity.visual.sprite.setFlipX(snapshot.flipX);

    // restore HP proportion
    newEntity.currentHp = Math.floor(
      newEntity.profile.combat.maxHp * snapshot.hpRatio,
    );

    // restore domain preference
    const profile = resolveProfile(targetKey);
    const movement = profile.movement;

    if (movement.mode === "air") {
      newEntity.movement.switchDomain?.("air");
    }

    if (movement.mode === "multi-domain") {
      const preferred = snapshot.wasInAir ? "air" : movement.default;
      newEntity.movement.switchDomain(preferred);
    }

    // global state
    GameState.currentForm = targetKey;

    newEntity._isChangingForm = false;
  });
}
