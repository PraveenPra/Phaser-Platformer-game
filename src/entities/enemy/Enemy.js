import { Character } from "../common/Character.js";
import { resolveProfile } from "../digimon/resolveProfile.js";
import { EnemyAI } from "./EnemyAI.js";
import { CharacterHealthBar } from "../common/CharacterHealthBar.js";
import { EnemyFactory } from "./EnemyFactory.js";
import { EnemyArchetypes } from "./EnemyArchetypes.js";

export class Enemy extends Character {
  constructor(scene, x, y, textureKey, spawnConfig = {}) {
    const profile = resolveProfile(textureKey);
    const { level = 1, role = "grunt" } = spawnConfig;

    super(scene, x, y, textureKey, profile, "idle");

    this.type = "enemy";
    this.role = "enemy";

    this.healthBar = new CharacterHealthBar(scene, this, {
      visible: false, // show only on hit
    });

    // not let others push enemy
    this.bodyLayer.body.setImmovable(true);
    this.bodyLayer.body.pushable = false;
    // optional

    const baseStats = {
      maxHp: 20,
      attack: 5,
    };

    this.archetype = EnemyArchetypes[role] ?? EnemyArchetypes.grunt;
    this.combatRules = this.archetype.combatRules;

    this.stats = EnemyFactory.createStats({
      base: baseStats,
      level,
      role,
    });

    this.ai = new EnemyAI(this.archetype.aiProfile);

    console.log(`[Enemy Spawned] ${textureKey}`, {
      role,
      level,
      stats: this.stats,
    });
    console.log("AI profile:", this.archetype.aiProfile);
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

        // destroy debug graphics
        this.ai.destroyDebug();

        // destroy entity
        this.destroy();
      },
    });
  }

  getAttackTargets(scene) {
    return scene.player ? [scene.player] : [];
  }
}
