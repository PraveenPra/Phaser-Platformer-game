import { GroundStates } from "../common/states/groundStates.js";
import { Character } from "../common/Character.js";
import { resolveProfile } from "../digimon/resolveProfile.js";
import { EnemyAI } from "./EnemyAI.js";
import { CharacterHealthBar } from "../common/CharacterHealthBar.js";

export class Enemy extends Character {
  constructor(scene, x, y, textureKey) {
    const profile = resolveProfile(textureKey);
    super(scene, x, y, textureKey, profile, GroundStates, "idle");

    this.role = "enemy";
    this.healthBar = new CharacterHealthBar(scene, this, {
      visible: false, // show only on hit
    });

    // not let others push enemy
    this.body.setImmovable(true);
    this.body.pushable = false; // optional

    this.ai = new EnemyAI();
  }

  update(dt) {
    // 🔒 hit & dead override AI
    if (this.state.current === "hit" || this.state.current === "dead") {
      super.update(dt);
      return;
    }

    this.ai.update(this, dt);
    super.update(dt);
  }

  onDeathAnimationComplete() {
    const sprite = this.visual.sprite;

    // fade out
    this.scene.tweens.add({
      targets: sprite,
      alpha: 0,
      duration: 500,
      ease: "Linear",
      onComplete: () => {
        // remove from enemy group
        if (this.scene.enemies) {
          this.scene.enemies.remove(this, true, true);
        }

        // destroy entity
        this.destroy();
      },
    });
  }

  getAttackTargets(scene) {
    return scene.player ? [scene.player] : [];
  }
}
