import { resolveProfile } from "../digimon/resolveProfile.js";
import { Character } from "../common/Character.js";
import { PlayerInput } from "./PlayerInput.js";
import { GroundStates } from "../common/states/groundStates.js";
import { AirMovement } from "../../systems/AirMovement.js";
import { AirStates } from "../common/states/airStates.js";
import { GroundMovement } from "../../systems/GroundMovement.js";

export class Player extends Character {
  constructor(scene, x, y, textureKey) {
    const profile = resolveProfile(textureKey);
    // let movemt = null;

    // if (profile.movement?.mode == "air") {
    //   movemt = new AirMovement(this);
    // } else {
    //   movemt = new GroundMovement(this);
    // }

    super(scene, x, y, textureKey, profile, "idle");

    this.type = "player";
    // if (profile.movement?.mode == "air") {
    //   this.bodyLayer.body.setAllowGravity(false);
    // }

    // Swap movement controller to air movement
    // this.movement = new AirMovement(this);
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

  getAttackTargets(scene) {
    return scene.enemies;
  }
}
