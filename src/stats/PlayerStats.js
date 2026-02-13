import { createDamageResult } from "/src/combat/DamageTypes.js";

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
  applyDamage(packet) {
    if (this.runtime.isDead) {
      return createDamageResult({ applied: false });
    }

    // Invincibility handling moves HERE
    if (this.isInvincible && !packet.flags?.ignoresInvincibility) {
      return createDamageResult({ applied: false, blocked: true });
    }

    const raw = packet.amount;
    const finalDamage = Math.max(1, raw - this.defense);

    this.changeHp(-finalDamage);

    const killed = this.runtime.currentHp <= 0;

    if (killed) {
      this.runtime.isDead = true;
      this.emit("dead");
    } else {
      // trigger i-frames
      this.isInvincible = true;
      this.emit("invincible-start");

      setTimeout(() => {
        this.isInvincible = false;
        this.emit("invincible-end");
      }, this.iFrameDuration);
    }

    return createDamageResult({
      applied: true,
      amount: finalDamage,
      killed,
      triggeredInvincibility: !killed,
    });
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
