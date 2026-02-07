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

    const entry = {
      def: effectDef,
      remaining: effectDef.duration,
      elapsed: 0,
      stacks: 1,
      vfx: null,
    };

    // 🔥 APPLY HOOK
    if (effectDef.onApply) {
      effectDef.onApply(this.owner, entry);
    }

    this.active.set(effectDef.id, entry);
  }

  update(dt) {
    if (!this.owner.active || this.owner.isDead) return;

    for (const [id, effect] of this.active) {
      effect.remaining -= dt;
      effect.elapsed += dt;

      // Tick
      if (
        effect.def.damagePerTick &&
        effect.elapsed >= effect.def.tickInterval
      ) {
        effect.elapsed = 0;

        this.owner.applyEffectDamage(effect.def.damagePerTick * effect.stacks);

        // 🔥 TICK HOOK (visual pulse, not hit)
        if (effect.def.onTick) {
          effect.def.onTick(this.owner, effect);
        }
      }

      if (effect.remaining <= 0) {
        // 🔥 REMOVE HOOK
        if (effect.def.onRemove) {
          effect.def.onRemove(this.owner, effect);
        }

        this.active.delete(id);
      }
    }
  }

  has(id) {
    return this.active.has(id);
  }

  clearAll() {
    for (const [id, effect] of this.active) {
      if (effect.def.onRemove) {
        effect.def.onRemove(this.owner, effect);
      }
    }
    this.active.clear();
  }
}
