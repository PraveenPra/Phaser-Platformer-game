import { PlayerState } from "./PlayerState.js";

export class RunState extends PlayerState {
  enter(player) {
    player.playAnim(`${player.texture.key}_run`);
  }

  update(player, cursors) {
    //for now attack  lives in IdleState and RunState because:
    //Those are the states where attacks are allowed
    //Attack is a state transition, not a global action

    if (player.attackKeys.main.isDown && player.canUseAttack("main")) {
      player.setState("attack", "main");
      return;
    }
    if (player.attackKeys.skill1.isDown && player.canUseAttack("skill1")) {
      player.setState("attack", "skill1");
      return;
    }
    if (player.attackKeys.skill2.isDown && player.canUseAttack("skill2")) {
      player.setState("attack", "skill2");
      return;
    }

    // ----------------------------------------
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
