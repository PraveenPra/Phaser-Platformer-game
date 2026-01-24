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

  // =================================================
  // SNAPSHOT RUNTIME STATE (ONLY WHAT MAKES SENSE)
  // =================================================
  const snapshot = {
    x: entity.x,
    y: entity.y,
    flipX: entity.visual.sprite.flipX,
    hpRatio: entity.hp / entity.maxHp,
    velocityY: entity.bodyLayer.body.velocity.y,
    wasInAir:
      entity.movement?.activeDomain === "air" ||
      entity.bodyLayer.body.velocity.y !== 0,
  };

  // =================================================
  // DESTROY OLD ENTITY
  // =================================================
  entity.destroy();

  // =================================================
  // SPAWN NEW ENTITY VIA SCENE (CRITICAL)
  // =================================================
  const newEntity = scene.spawnPlayer(snapshot.x, snapshot.y, targetKey);

  if (!newEntity) return;

  // =================================================
  // RESTORE SAFE STATE
  // =================================================
  newEntity.visual.sprite.setFlipX(snapshot.flipX);

  // HP scaling
  newEntity.hp = Math.floor(newEntity.maxHp * snapshot.hpRatio);

  // =================================================
  // DOMAIN RULE (VERY IMPORTANT)
  // =================================================
  const profile = resolveProfile(targetKey);
  const movement = profile.movement;

  if (movement.mode === "air") {
    newEntity.movement.switchDomain?.("air");
  }

  if (movement.mode === "multi-domain") {
    const preferred = snapshot.wasInAir ? "air" : movement.default;

    newEntity.movement.switchDomain(preferred);
  }

  // =================================================
  // GLOBAL STATE
  // =================================================
  GameState.selectedDigimon = targetKey;

  return newEntity;
}
