import { resolveProfile } from "/src/entities/digimon/resolveProfile.js";
import { GameState } from "/src/GameState.js";
import { playFreezeFlash } from "/src/entities/common/vfx/FormTransitionFX.js";
import { playDataScanFX } from "/src/entities/common/vfx/DigimonDataScanFX.js";
import { AudioManager } from "/src/systems/AudioManager.js";

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
  // SNAPSHOT RUNTIME STATE
  // =================================================
  const snapshot = {
    x: entity.x,
    y: entity.y,
    flipX: entity.visual.sprite.flipX,
    hpRatio: entity.currentHp / entity.profile.combat.maxHp,
    velocity: {
      x: entity.bodyLayer.body.velocity.x,
      y: entity.bodyLayer.body.velocity.y,
    },

    // 👇 THIS IS THE KEY FIX
    // ✅ FINAL SOURCE OF TRUTH
    wasFlyingIntent:
      entity.canAir &&
      (!entity.canGround || // air-only Digimon
        entity.movement?.activeDomain === "air"),
  };

  entity.state.setState("preEvolution");

  // =================================================
  // FREEZE COMPLETELY (physics + animation + position)
  // =================================================
  const frozenY = snapshot.y;

  entity.bodyLayer.body.setVelocity(0, 0);
  entity.bodyLayer.body.allowGravity = false;
  entity.visual.sprite.anims.pause();

  playFreezeFlash(entity.visual.sprite);

  // =================================================
  // SFX
  // =================================================
  AudioManager.playSFX(
    scene,
    reason === "evolution" ? "sfx-evolution" : "sfx-blast-hit",
    {
      volume: reason === "evolution" ? 0.9 : 0.6,
      rate: Phaser.Math.FloatBetween(0.95, 1.05),
    },
  );

  const OUT_DURATION = reason === "evolution" ? 1500 : 900;
  const IN_DURATION = reason === "evolution" ? 1500 : 900;

  // =================================================
  // DATA SCAN OUT (OLD FORM)
  // =================================================
  playDataScanFX({
    scene,
    sourceSprite: entity.visual.sprite,
    direction: "up",
    duration: OUT_DURATION,
  });

  // =================================================
  // AFTER SCAN OUT → DESTROY + SPAWN NEW
  // =================================================
  scene.time.delayedCall(OUT_DURATION, () => {
    entity.destroy();

    const newEntity = scene.spawnPlayer(snapshot.x, frozenY, targetKey);
    if (!newEntity) return;

    newEntity.state.setState("postEvolution");

    // freeze new form immediately
    newEntity.visual.sprite.setTintFill(0xffffff);
    newEntity.visual.sprite.anims.pause();
    newEntity.bodyLayer.body.setVelocity(0, 0);
    newEntity.bodyLayer.body.allowGravity = false;

    // restore facing
    newEntity.visual.sprite.setFlipX(snapshot.flipX);

    // restore HP proportion
    newEntity.currentHp = Math.floor(
      newEntity.profile.combat.maxHp * snapshot.hpRatio,
    );

    // domain decision (but no movement yet)
    const profile = resolveProfile(targetKey);
    if (profile.movement.mode === "air") {
      newEntity.movement.switchDomain?.("air");
    } else if (profile.movement.mode === "multi-domain") {
      newEntity.movement.switchDomain(
        snapshot.wasInAir ? "air" : profile.movement.default,
      );
    }

    GameState.currentForm = targetKey;

    // =================================================
    // DATA SCAN IN (NEW FORM)
    // =================================================
    playDataScanFX({
      scene,
      sourceSprite: newEntity.visual.sprite,
      direction: "down",
      duration: IN_DURATION,
    });

    // =================================================
    // FINAL REVEAL
    // =================================================
    scene.time.delayedCall(IN_DURATION, () => {
      newEntity.visual.sprite.clearTint();

      const newProfile = resolveProfile(targetKey);
      const moveMode = newProfile.movement.mode;

      // AIR-ONLY → always fly
      if (moveMode === "air") {
        newEntity.y -= 8; // subtle lift
        newEntity.state.setState("airIdle");
      }

      // HYBRID → preserve previous domain
      else if (moveMode === "multi-domain") {
        console.log("wasFlyingIntent aft:", snapshot.wasFlyingIntent);

        if (snapshot.wasFlyingIntent) {
          newEntity.state.setState("airIdle");
        } else {
          newEntity.state.setState("idle");
        }
      }

      // GROUND-ONLY
      else {
        newEntity.state.setState("idle");
      }

      newEntity._isChangingForm = false;
    });
  });
}
