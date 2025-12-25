import { PlayerState } from "./PlayerState.js";

export class IdleState extends PlayerState {
  enter(player) {
    player.playAnim(`${player.texture.key}_idle`);
    player.setVelocityX(0);
  }

  update(player, cursors) {
    if (cursors.left.isDown || cursors.right.isDown) {
      player.setState("run");
    } else if (cursors.up.isDown && player.body.onFloor()) {
      player.setState("jump");
    }
  }
}
