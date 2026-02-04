export class PlayerStats extends Phaser.Events.EventEmitter {
  constructor(base, progression) {
    super();

    this.base = base;
    this.progression = progression;

    this.runtime = {
      currentHp: this.maxHp,
    };

    // 🔥 IMPORTANT: emit initial state so HUD shows values immediately
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

  changeHp(delta) {
    this.runtime.currentHp = Math.max(0, this.runtime.currentHp + delta);

    this.emit("hp-changed", this.runtime.currentHp, this.maxHp);
  }

  setHp(value) {
    this.runtime.currentHp = Phaser.Math.Clamp(value, 0, this.maxHp);
    this.emit("hp-changed", this.runtime.currentHp, this.maxHp);
  }

  resetHp() {
    this.setHp(this.maxHp);
  }
}
