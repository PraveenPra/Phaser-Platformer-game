import { StatusEffects } from "./StatusEffects.js";

export class StatusEffectApplier {
  static apply(target, effectKey) {
    const def = StatusEffects[effectKey];
    if (!def) return;

    target.statusEffects.add(def);
  }
}
