import { MovementController } from "./MovementController.js";

export class AirMovement extends MovementController {
  moveHorizontal(dir) {
    const body = this.entity.bodyLayer.body;
    const move = this.entity.profile.move;

    body.setAccelerationX(dir * move.airAccel);
    body.setMaxVelocity(move.maxAirSpeed, body.maxVelocity.y);

    if (dir !== 0) {
      this.entity.visual.flip(dir < 0);
    }
  }

  // moveVertical(dir) {
  //   const body = this.entity.bodyLayer.body;
  //   const move = this.entity.profile.move;

  //   body.setAccelerationY(dir * move.airAccel);
  //   body.setMaxVelocity(body.maxVelocity.x, move.maxAirSpeed);
  // }

  moveVertical(dir) {
    const body = this.entity.bodyLayer.body;
    const speed =
      this.entity.profile.move.airSpeed ?? this.entity.profile.move.speed;

    body.setVelocityY(dir * speed);
  }

  stop() {
    const body = this.entity.bodyLayer.body;
    const move = this.entity.profile.move;
    //Air drag should be much lower than ground, otherwise flying feels wrong.
    body.setAcceleration(0, 0);
    body.setDrag(move.airDecel, move.airDecel);
  }
}
