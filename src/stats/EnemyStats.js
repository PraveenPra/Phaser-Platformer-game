import { createDamageResult } from "/src/combat/DamageTypes.js";

export class EnemyStats {
  constructor(base) {
    this.base = base;

    this.runtime = {
      currentHp: base.maxHp,
      isDead: false,
    };
  }

  get maxHp() {
    return this.base.maxHp;
  }

  get attack() {
    return this.base.attack;
  }

  get defense() {
    return this.base.defense ?? 0;
  }

  applyDamage(packet) {
    if (this.runtime.isDead) {
      return createDamageResult({ applied: false });
    }

    const raw = packet.amount;
    const finalDamage = Math.max(1, raw - this.defense);

    this.runtime.currentHp -= finalDamage;

    if (this.runtime.currentHp <= 0) {
      this.runtime.currentHp = 0;
      this.runtime.isDead = true;

      return createDamageResult({
        applied: true,
        amount: finalDamage,
        killed: true,
      });
    }

    return createDamageResult({
      applied: true,
      amount: finalDamage,
      killed: false,
    });
  }

  resetHp() {
    this.runtime.currentHp = this.base.maxHp;
    this.runtime.isDead = false;
  }
}
