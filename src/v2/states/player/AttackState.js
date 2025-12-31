import { PlayerState } from "./PlayerState.js";
import { AttackData } from "../../data/AttackData.js";

export class AttackState extends PlayerState {
  enter(player, attackKey) {
    this.player = player;
    this.attackKey = attackKey;

    const attackConfig = player.attacks[attackKey];
    this.attackData = AttackData[attackKey];

    if (!attackConfig || !attackConfig.unlocked || !this.attackData) {
      player.setState("idle");
      return;
    }

    player.setVelocityX(0);

    const animKey = `${player.texture.key}_${attackConfig.anim}`;
    player.playAnim(animKey);

    // Listen for animation frames
    player.on(
      Phaser.Animations.Events.ANIMATION_UPDATE,
      this.onAnimationFrame,
      this
    );

    // When animation finishes, clean up and exit state
    player.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      player.off(
        Phaser.Animations.Events.ANIMATION_UPDATE,
        this.onAnimationFrame,
        this
      );
      player.setState("idle");
    });
  }

  onAnimationFrame(anim, frame) {
    if (this.attackData.type !== "melee") return;
    if (!this.attackData.hitFrames.includes(frame.index)) return;

    this.player.spawnAttackHitbox(
      this.attackData.hitbox,
      this.attackData.damage
    );
  }

  update() {
    // input locked during attack
  }
}
