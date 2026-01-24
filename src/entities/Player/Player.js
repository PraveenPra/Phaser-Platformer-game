import { resolveProfile } from "../digimon/resolveProfile.js";
import { Character } from "../common/Character.js";
import { PlayerInput } from "./PlayerInput.js";
import { changeForm } from "/src/systems/FormChangeController.js";
import { GameState } from "/src/GameState.js";

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

    if (this.isDead || this.state?.current === "dead") return;

    if (this.input.switchForm) {
      // cycle base forms (simple version)
      const forms = Array.from(GameState.unlockedBaseForms);
      const index = forms.indexOf(this.profile.key);
      const next = forms[(index + 1) % forms.length];

      changeForm({
        scene: this.scene,
        entity: this,
        targetKey: next,
        reason: "switch",
      });
      return;
    }

    if (this.input.evolve) {
      const next = this.profile.evolution?.next;
      if (!next) return;

      changeForm({
        scene: this.scene,
        entity: this,
        targetKey: next,
        reason: "evolution",
      });
      return;
    }

    super.update(dt);
  }

  onDeathAnimationComplete() {
    // future:
    // - respawn
    // - game over screen
    // - fade out
    this.scene.events.emit("player-dead");
  }

  getAttackTargets(scene) {
    return scene.enemies;
  }
}
