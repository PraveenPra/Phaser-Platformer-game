export class CharacterHealthBar {
  constructor(scene, owner, config = {}) {
    this.scene = scene;
    this.owner = owner;

    this.width = config.width ?? 24;
    this.height = config.height ?? 4;
    this.offsetY = config.offsetY ?? -40;

    this.bgColor = 0x000000;
    this.hpColor = 0x00ff00;

    this.graphics = scene.add.graphics();
    this.graphics.setDepth(1000);

    owner.add(this.graphics);

    this.draw();
  }

  draw() {
    const hpRatio = this.owner.currentHp / this.owner.profile.combat.maxHp;

    this.graphics.clear();

    // background
    this.graphics.fillStyle(this.bgColor, 0.6);
    this.graphics.fillRect(
      -this.width / 2,
      this.offsetY,
      this.width,
      this.height
    );

    // hp
    this.graphics.fillStyle(this.hpColor, 1);
    this.graphics.fillRect(
      -this.width / 2,
      this.offsetY,
      this.width * Phaser.Math.Clamp(hpRatio, 0, 1),
      this.height
    );
  }

  destroy() {
    this.graphics.destroy();
  }
}
