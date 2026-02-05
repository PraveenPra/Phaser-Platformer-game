export class PlayerStats extends Phaser.Events.EventEmitter {
  constructor(base, progression) {
    super();

    this.base = base;
    this.progression = progression;

    this.runtime = {
      currentHp: this.maxHp,
      isDead: false,
      invincible: false,
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

  // 🔥 NEW — single entry for damage
  takeDamage(amount) {
    if (this.runtime.isDead) return;

    // ✅ i-frame gate
    if (this.runtime.invincible) return;

    const finalDamage = Math.max(1, amount - this.defense);
    this.changeHp(-finalDamage);

    // ✅ start i-frames on successful hit
    this.startIFrames();

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
    this.runtime.invincible = false;

    this.emit("hp-changed", this.runtime.currentHp, this.maxHp);
  }

  startIFrames() {
    this.runtime.invincible = true;
    this.emit("invincible-start");

    //We intentionally do not use scene.time here
    // because PlayerStats is not a Scene object.
    // setTimeout is perfectly fine for logic-layer timing.
    setTimeout(() => {
      this.runtime.invincible = false;
      this.emit("invincible-end");
    }, this.iFrameDuration);
  }
}
