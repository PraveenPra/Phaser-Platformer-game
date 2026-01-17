// GroundMovement.js
export class GroundMovement {
  constructor(entity) {
    this.entity = entity;
    this.speed = entity.profile.move?.speed || 80;
    this.jumpForce = entity.profile.move?.jump || 400;
  }

  stop() {
    this.entity.bodyLayer.body.setVelocityX(0);
  }

  moveHorizontal(dir) {
    this.entity.bodyLayer.body.setVelocityX(dir * this.speed);
    this.entity.visual.flip(dir < 0);
  }

  jump() {
    const body = this.entity.bodyLayer.body;
    if (body.onFloor()) {
      body.setVelocityY(-this.jumpForce);
    }
  }

  airControl(dir) {
    const body = this.entity.bodyLayer.body;
    body.setVelocityX(dir * this.speed);
    this.entity.visual.flip(dir < 0);
  }

  hasGroundAhead(dir, distance = 8, depth = 24) {
    const body = this.entity.bodyLayer.body;
    const scene = this.entity.scene;

    const x = body.x + body.width / 2 + dir * distance;
    const y = body.y + body.height + depth;

    if (!scene.groundLayer) return false;

    const tile = scene.groundLayer.getTileAtWorldXY(x, y);
    return !!(tile && tile.collides);
  }
}
