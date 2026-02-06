export class PlayerStats extends Phaser.Events.EventEmitter {
  constructor(base, progression) {
    super();

    this.base = base;
    this.progression = progression;

    this.runtime = {
      currentHp: this.maxHp,
      isDead: false,
    };
    this.iFrameDuration = 800; // invincibility frame duration
    this.emit("hp-changed", this.runtime.currentHp, this.maxHp);
  }

  get maxHp() {
    return this.base.maxHp + this.progression.maxHpBonus;
  }

  get attack() {
    return this.base.attack + this.progression.attackBonus;
  }

  get defense() {
    return this.base.defense + this.progression.defenseBonus;
  }

  // NEW — single entry for damage
  takeDamage(amount) {
    if (this.runtime.isDead) return;

    const finalDamage = Math.max(1, amount - this.defense);
    this.changeHp(-finalDamage);

    if (this.runtime.currentHp <= 0) {
      this.runtime.isDead = true;
      this.emit("dead");
    }
  }

  changeHp(delta) {
    this.runtime.currentHp = Phaser.Math.Clamp(
      this.runtime.currentHp + delta,
      0,
      this.maxHp,
    );

    this.emit("hp-changed", this.runtime.currentHp, this.maxHp);
  }

  resetHp() {
    this.runtime.currentHp = this.maxHp;
    this.runtime.isDead = false;

    this.emit("hp-changed", this.runtime.currentHp, this.maxHp);
  }
}
