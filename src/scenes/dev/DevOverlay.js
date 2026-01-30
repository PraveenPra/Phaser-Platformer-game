class DevOverlay {
  constructor(scene, character) {
    this.scene = scene;
    this.char = character;

    this.gfx = scene.add.graphics();
  }

  update() {
    this.gfx.clear();

    this.drawBody();
    this.drawOrigin();
    this.drawMeleeHitbox();
    this.drawProjectilePoint();
  }

  drawBody() {
    const body = this.char.bodyLayer.body;
    this.gfx.lineStyle(2, 0x00ff00, 1);
    this.gfx.strokeRect(body.x, body.y, body.width, body.height);
  }

  drawOrigin() {
    const s = this.char.visual.sprite;
    const x = s.getWorldTransformMatrix().tx;
    const y = s.getWorldTransformMatrix().ty;

    this.gfx.lineStyle(1, 0xff0000);
    this.gfx.strokeLineShape(new Phaser.Geom.Line(x - 6, y, x + 6, y));
    this.gfx.strokeLineShape(new Phaser.Geom.Line(x, y - 6, x, y + 6));
  }

  drawMeleeHitbox() {
    const atk = this.char.profile.attacks?.main;
    if (!atk?.hitbox) return;

    const b = atk.hitbox;
    const body = this.char.bodyLayer.body;

    this.gfx.lineStyle(2, 0xffaa00);
    this.gfx.strokeRect(
      body.x + b.offsetX,
      body.y + b.offsetY,
      b.width,
      b.height,
    );
  }

  drawProjectilePoint() {
    const atk = this.char.profile.attacks?.main;
    if (!atk?.projectile) return;

    const p = atk.projectile;
    const body = this.char.bodyLayer.body;

    this.gfx.fillStyle(0x00ffff);
    this.gfx.fillCircle(
      body.center.x + p.offsetX,
      body.center.y + p.offsetY,
      3,
    );
  }
}
