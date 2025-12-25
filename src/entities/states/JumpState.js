import { PlayerState } from "./PlayerState.js";

export class JumpState extends PlayerState {
  enter(player) {
    player.setVelocityY(-player.jumpPower);
    player.playAnim(`${player.texture.key}_jump`);
  }

  update(player) {
    if (player.body.onFloor()) {
      player.setState("idle");
    }
  }
}
