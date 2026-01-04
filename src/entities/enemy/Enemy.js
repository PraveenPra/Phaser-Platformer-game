import { GroundStates } from "../common/states/groundStates.js";
import { Character } from "../common/Character.js";
import { resolveProfile } from "../digimon/resolveProfile.js";
import { EnemyAI } from "./EnemyAI.js";

export class Enemy extends Character {
  constructor(scene, x, y, textureKey) {
    const profile = resolveProfile(textureKey);
    super(scene, x, y, textureKey, profile, GroundStates, "idle");

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
}
