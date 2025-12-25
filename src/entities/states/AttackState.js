import { PlayerState } from "./PlayerState.js";

export class AttackState extends PlayerState {
  enter(player, attackKey) {
    const attack = player.attacks[attackKey];

    if (!attack || !attack.unlocked) {
      player.setState("idle");
      return;
    }

    player.setVelocityX(0);

    const animKey = `${player.texture.key}_${attack.anim}`;
    player.playAnim(animKey);

    // IMPORTANT: wait for animation to finish
    player.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      player.setState("idle");
    });
  }

  update() {
    // locked during attack
  }
}
