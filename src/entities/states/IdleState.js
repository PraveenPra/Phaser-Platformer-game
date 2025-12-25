import { PlayerState } from "./PlayerState.js";

export class IdleState extends PlayerState {
  enter(player) {
    player.playAnim(`${player.texture.key}_idle`);
    player.setVelocityX(0);
  }

  update(player, cursors) {
    if (player.attackKeys.main.isDown) {
      player.setState("attack", "main");
      return;
    }
    if (player.attackKeys.skill1.isDown) {
      player.setState("attack", "skill1");
      return;
    }
    if (player.attackKeys.skill2.isDown) {
      player.setState("attack", "skill2");
      return;
    }

    // -----------------------------------
    if (cursors.left.isDown || cursors.right.isDown) {
      player.setState("run");
    } else if (cursors.up.isDown && player.body.onFloor()) {
      player.setState("jump");
    }
  }
}
