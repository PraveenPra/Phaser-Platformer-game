export class MovementController {
  constructor(entity) {
    this.entity = entity;
  }

  stop() {
    const body = this.entity.bodyLayer.body;
    body.setVelocityX(0);
  }

  moveHorizontal(dir) {
    const body = this.entity.bodyLayer.body;
    const speed = this.entity.profile.move.speed;

    body.setVelocityX(dir * speed);
    this.entity.visual.flip(dir < 0);
  }

  jump() {
    const body = this.entity.bodyLayer.body;
    if (body.onFloor()) {
      body.setVelocityY(-this.entity.profile.move.jump);
    }
  }

  airControl(dir) {
    const body = this.entity.bodyLayer.body;
    const speed = this.entity.profile.move.speed;

    body.setVelocityX(dir * speed);
    this.entity.visual.flip(dir < 0);
  }
}
