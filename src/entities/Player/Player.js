import { resolveProfile } from "../digimon/resolveProfile.js";
import { Character } from "../common/Character.js";
import { PlayerInput } from "./PlayerInput.js";
import { changeForm } from "/src/systems/FormChangeController.js";
import { GameState } from "/src/GameState.js";
import { PlayerStats } from "/src/stats/PlayerStats.js";

export class Player extends Character {
  constructor(scene, x, y, textureKey) {
    const profile = resolveProfile(textureKey);

    super(scene, x, y, textureKey, profile, "idle");

    this.type = "player";
    this.isInvincible = false;
    this.isDead = false;

    // not let others push enemy
    this.bodyLayer.body.setImmovable(true);
    this.bodyLayer.body.pushable = false;
    this.bodyLayer.body.setCollideWorldBounds(true);
    this.bodyLayer.body.onWorldBounds = true;

    this.inputHandler = new PlayerInput(scene);

    this.stats = new PlayerStats(
      {
        maxHp: 100,
        attack: 20,
        defense: 5,
      },
      GameState.playerProgression,
    );

    //Prevents desync if death happens outside animation
    // Future-proof (DOT damage, void, poison, etc.)
    this.stats.on("dead", () => {
      this.isDead = true;
    });
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

  getBaseAttackPower() {
    return this.stats.attack;
  }

  onDeathAnimationComplete() {
    // future:
    // - respawn
    // - game over screen
    // - fade out
    GameState.currentForm = GameState.selectedDigimon;

    this.stats.resetHp();

    this.scene.events.emit("player-dead");
  }

  getAttackTargets(scene) {
    return scene.enemies;
  }

  forceKill(reason = "void") {
    if (this.isDead) return;

    this.isDead = true;
    this.state.setState("dead", { reason });
  }
}
