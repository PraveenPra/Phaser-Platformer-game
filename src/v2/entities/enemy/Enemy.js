import { Character } from "../common/Character.js";
import { resolveProfile } from "../digimon/resolveProfile.js";
import { EnemyGroundStates } from "../common/states/EnemyGroundStates.js";
import { EnemyAI } from "./EnemyAI.js";

export class Enemy extends Character {
  constructor(scene, x, y, textureKey) {
    const profile = resolveProfile(textureKey);
    super(scene, x, y, textureKey, profile, EnemyGroundStates, "idle");

    this.ai = new EnemyAI();
  }

  update(dt) {
    this.ai.update(this, dt);
    super.update(dt);
  }
}
