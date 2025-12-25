import { PlayerState } from "./PlayerState.js";

export class RunState extends PlayerState {
  enter(player) {
    player.playAnim(`${player.texture.key}_run`);
  }

  update(player, cursors) {
    if (cursors.left.isDown) {
      player.setVelocityX(-player.speed);
      player.setFlipX(true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(player.speed);
      player.setFlipX(false);
    } else {
      player.setState("idle");
    }

    if (cursors.up.isDown && player.body.onFloor()) {
      player.setState("jump");
    }
  }
}
