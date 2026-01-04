import { resolveProfile } from "../digimon/resolveProfile.js";
import { Character } from "../common/Character.js";
import { PlayerInput } from "./PlayerInput.js";
import { GroundStates } from "../common/states/groundStates.js";

export class Player extends Character {
  constructor(scene, x, y, textureKey) {
    const profile = resolveProfile(textureKey);
    super(scene, x, y, textureKey, profile, GroundStates, "idle");

    this.type = "player";

    this.inputHandler = new PlayerInput(scene);
  }

  update(dt) {
    this.inputHandler.update(this);
    super.update(dt);
  }

  onDeathAnimationComplete() {
    // future:
    // - respawn
    // - game over screen
    // - fade out
  }
}
