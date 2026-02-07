export class StatusEffectManager {
  constructor(owner) {
    this.owner = owner;
    this.active = new Map();
  }

  add(effectDef) {
    const existing = this.active.get(effectDef.id);

    if (existing) {
      if (effectDef.refreshOnReapply) {
        existing.remaining = effectDef.duration;
      }
      if (effectDef.stackable) {
        existing.stacks = Math.min(
          existing.stacks + 1,
          effectDef.maxStacks ?? Infinity,
        );
      }
      return;
    }

    this.active.set(effectDef.id, {
      def: effectDef,
      remaining: effectDef.duration,
      elapsed: 0,
      stacks: 1,
    });
  }

  update(dt) {
    for (const [id, effect] of this.active) {
      effect.remaining -= dt;
      effect.elapsed += dt;

      // Tick damage
      if (
        effect.def.damagePerTick &&
        effect.elapsed >= effect.def.tickInterval
      ) {
        effect.elapsed = 0;
        this.owner.applyEffectDamage(effect.def.damagePerTick * effect.stacks);
      }

      if (effect.remaining <= 0) {
        this.active.delete(id);
      }
    }
  }

  has(id) {
    return this.active.has(id);
  }
}
