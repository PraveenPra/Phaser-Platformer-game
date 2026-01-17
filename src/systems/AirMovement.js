import { MovementController } from "./MovementController.js";

export class AirMovement extends MovementController {
  moveHorizontal(dir) {
    const body = this.entity.bodyLayer.body;
    const speed =
      this.entity.profile.move.airSpeed ?? this.entity.profile.move.speed;

    body.setVelocityX(dir * speed);

    if (dir !== 0) {
      this.entity.visual.flip(dir < 0);
    }
  }

  moveVertical(dir) {
    const body = this.entity.bodyLayer.body;
    const speed =
      this.entity.profile.move.airSpeed ?? this.entity.profile.move.speed;

    body.setVelocityY(dir * speed);
  }

  stop() {
    this.entity.bodyLayer.body.setVelocity(0, 0);
  }
}
