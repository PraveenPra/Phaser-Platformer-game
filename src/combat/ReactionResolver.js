import { DefaultCombatRules } from "./CombatRules.js";

export class ReactionResolver {
  static canApplyReaction(target, reactionKey) {
    const rules = target.combatRules ?? DefaultCombatRules;
    return rules.reactions?.[reactionKey] !== false;
  }

  static getStatusMultiplier(target, statusKey) {
    const rules = target.combatRules ?? DefaultCombatRules;

    const mult = rules.statusResistance?.[statusKey];
    if (mult === 0) return 0;

    return mult ?? 1.0;
  }
}
