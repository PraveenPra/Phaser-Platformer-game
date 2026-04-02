import { createDamagePacket } from "/src/combat/DamageTypes.js";
import { ReactionResolver } from "/src/combat/ReactionResolver.js";
import { StatusEffectApplier } from "/src/entities/common/status/StatusEffectApplier.js";
import { doHitStop } from "../vfx/doHitStop.js";
import { spawnImpactVFX } from "../vfx/spawnImpactVFX.js";

export function applyExplosionDamage(scene, source) {
  const radius = source.explosionRadius ?? 48;
  const targets = source.owner.getAttackTargets(scene);

  let didHitSomething = false;

  targets.children.iterate((target) => {
    if (!target || !target.active || !target.receiveDamage) return;
    if (target === source.owner) return;

    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const distSq = dx * dx + dy * dy;

    if (distSq > radius * radius) return;

    const damagePacket = createDamagePacket({
      amount: source.damage,
      source: source.owner,
      attack: source.attack ?? null,
      hitReaction: source.hitReaction,
      type: source.owner.role === "player" ? "player-attack" : "enemy-attack",
      flags: source.flags,
    });

    const result = target.receiveDamage(damagePacket);
    if (!result?.applied) return;

    // Hit-stop ONCE
    if (!didHitSomething) {
      const hitStopMs = source.hitStop ?? Math.min(80, 30 + source.damage * 2);
      doHitStop(scene, hitStopMs);
      didHitSomething = true;
    }

    // Status effects stay here
    if (source.statusEffect) {
      const mult = ReactionResolver.getStatusMultiplier(
        target,
        source.statusEffect,
      );

      if (mult > 0) {
        StatusEffectApplier.apply(target, source.statusEffect, {
          durationMultiplier: mult,
        });
      }
    }
  });
}
