// GroundMovement.js
export class GroundMovement {
  constructor(entity) {
    this.entity = entity;
    this.speed = entity.profile.move?.speed || 80;
    this.jumpForce = entity.profile.move?.jump || 400;
  }

  stop() {
    const body = this.entity.bodyLayer.body;
    const move = this.entity.profile.move;

    //Drag should be higher than accel on ground → snappy but weighty.
    body.setAccelerationX(0);
    body.setDragX(move.decel);
  }

  moveHorizontal(dir) {
    const body = this.entity.bodyLayer.body;
    const move = this.entity.profile.move;

    body.setAccelerationX(dir * move.accel);
    body.setMaxVelocity(move.speed, body.maxVelocity.y);

    if (dir !== 0) {
      this.entity.visual.flip(dir < 0);
    }
  }

  jump() {
    const body = this.entity.bodyLayer.body;
    if (body.onFloor()) {
      body.setVelocityY(-this.jumpForce);
    }
  }

  doubleJump() {
    const body = this.entity.bodyLayer.body;
    body.setVelocityY(-this.entity.profile.move.jump);
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
