import { EnemyStats } from "./EnemyStats.js";
import { EnemyArchetypes } from "./EnemyArchetypes.js";

export class EnemyFactory {
  static createStats({ base, level = 1, role = "grunt" }) {
    const archetype = EnemyArchetypes[role] ?? EnemyArchetypes.grunt;

    const maxHp = Math.round(base.maxHp * level * archetype.hpScale);
    const attack = Math.round(base.attack * level * archetype.attackScale);

    return new EnemyStats({
      maxHp,
      attack,
      defense: archetype.defense,
    });
  }
}
