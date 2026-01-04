export class PlayerHealthUI {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;

    this.width = 200;
    this.height = 14;

    this.bgGreen = 0x0b3d0b;
    this.green = 0x2ecc71;
    this.red = 0xe74c3c;

    this.graphics = scene.add.graphics();
    this.graphics.setScrollFactor(0); // 🔥 fixed to camera
    this.graphics.setDepth(2000);

    this.x = 20;
    this.y = 20;

    this.text = scene.add.text(
      this.x + this.width / 2,
      this.y + this.height + 4,
      "",
      {
        fontSize: "12px",
        color: "#ffffff",
        fontFamily: "Arial",
      }
    );

    this.text.setOrigin(0.5, 0);
    this.text.setScrollFactor(0);
    this.text.setDepth(2000);

    this.draw();
  }

  draw() {
    const maxHp = this.player.profile.combat.maxHp;
    const hp = this.player.currentHp;
    const ratio = hp / maxHp;
    const color = ratio <= 0.4 ? this.red : this.green;

    this.graphics.clear();

    // background
    this.graphics.fillStyle(this.bgGreen, 1);
    this.graphics.fillRect(this.x, this.y, this.width, this.height);

    // foreground
    this.graphics.fillStyle(color, 1);
    this.graphics.fillRect(
      this.x,
      this.y,
      this.width * Phaser.Math.Clamp(ratio, 0, 1),
      this.height
    );

    // 🔢 text
    this.text.setText(`${hp} / ${maxHp}`);
  }

  destroy() {
    this.graphics.destroy();
    this.text.destroy();
  }
}
