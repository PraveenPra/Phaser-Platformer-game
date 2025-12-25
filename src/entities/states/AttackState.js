import { PlayerState } from "./PlayerState.js";

export class AttackState extends PlayerState {
  enter(player, attackKey) {
    player.setVelocityX(0);

    const attack = player.attacks[attackKey];
    if (!attack) {
      player.setState("idle");
      return;
    }

    player.playAnim(`${player.texture.key}_${attack.anim}`);

    player.scene.time.delayedCall(attack.duration, () => {
      player.setState("idle");
    });
  }

  update() {
    // locked during attack
  }
}
