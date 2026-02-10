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

  takeDamage(amount) {
    if (this.runtime.isDead) return;

    const finalDamage = Math.max(1, amount - this.defense);
    this.runtime.currentHp -= finalDamage;

    if (this.runtime.currentHp <= 0) {
      this.runtime.currentHp = 0;
      this.runtime.isDead = true;
    }
  }

  resetHp() {
    this.runtime.currentHp = this.base.maxHp;
    this.runtime.isDead = false;
  }
}
