export class PlayerStats {
  constructor(base, progression, scene) {
    this.base = base;
    this.progression = progression;
    this.scene = scene;
    this.runtime = {
      currentHp: this.maxHp,
    };
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

    // notify UI
    this.scene.events.emit(
      "player-hp-changed",
      this.runtime.currentHp,
      this.maxHp,
    );
  }
}
