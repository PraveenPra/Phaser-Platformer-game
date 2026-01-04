export class CharacterHealthBar {
  constructor(scene, owner, config = {}) {
    this.scene = scene;
    this.owner = owner;

    this.width = config.width ?? 26;
    this.height = config.height ?? 5;
    this.offsetY = config.offsetY ?? -42;

    // colors
    this.bgGreen = 0x0b3d0b; // dark green background
    this.green = 0x2ecc71;
    this.red = 0xe74c3c;

    this.visible = config.visible ?? true;

    this.graphics = scene.add.graphics();
    this.graphics.setDepth(1000);

    owner.add(this.graphics);

    if (this.visible) {
      this.draw();
    } else {
      this.graphics.setVisible(false);
    }
  }

  show() {
    this.graphics.setVisible(true);
    this.draw();
  }

  draw() {
    const maxHp = this.owner.profile.combat.maxHp;
    const hp = this.owner.currentHp;
    const ratio = Phaser.Math.Clamp(hp / maxHp, 0, 1);

    const hpColor = ratio <= 0.4 ? this.red : this.green;

    this.graphics.clear();

    // background (dark green)
    this.graphics.fillStyle(this.bgGreen, 1);
    this.graphics.fillRect(
      -this.width / 2,
      this.offsetY,
      this.width,
      this.height
    );

    // hp foreground
    this.graphics.fillStyle(hpColor, 1);
    this.graphics.fillRect(
      -this.width / 2,
      this.offsetY,
      this.width * ratio,
      this.height
    );
  }

  destroy() {
    this.graphics.destroy();
  }
}
