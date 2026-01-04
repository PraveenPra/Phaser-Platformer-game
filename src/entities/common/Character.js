import { CharacterBody } from "./CharacterBody.js";
import { CharacterVisual } from "./CharacterVisual.js";
import { StateMachine } from "../../systems/StateMachine.js";
import { CharacterHealthBar } from "./CharacterHealthBar.js";

export class Character extends Phaser.GameObjects.Container {
  constructor(scene, x, y, textureKey, profile, states, initialState) {
    super(scene, x, y);
    scene.add.existing(this);

    this.key = textureKey;
    this.profile = profile;

    this.bodyLayer = new CharacterBody(scene, this, profile);
    this.visual = new CharacterVisual(scene, this, textureKey, profile);

    this.state = new StateMachine(this, initialState, states);

    this.attackCooldowns = {};
    this.isAttacking = false;
    this.currentAttackKey = null;
    this.requestedAttack = null;

    this.healthBar = new CharacterHealthBar(scene, this);

    // combat runtime state
    this.currentHp = profile.combat.maxHp;
    this.isInvincible = false;
    this.isDead = false;
  }

  update(dt) {
    this.state.update(dt);
  }

  canAttack(name) {
    const now = this.scene.time.now;
    const cd = this.attackCooldowns[name] || 0;
    return now >= cd && !this.isAttacking;
  }

  startCooldown(name, duration) {
    this.attackCooldowns[name] = this.scene.time.now + duration;
  }

  takeDamage(amount, source) {
    if (this.isDead || this.isInvincible) return;

    this.currentHp -= amount;
    this.currentHp = Math.max(0, this.currentHp);

    console.log(
      `[DAMAGE] ${this.key} took ${amount} dmg from ${source?.key} | HP=${this.currentHp}`
    );

    this.healthBar.draw();

    if (this.currentHp <= 0) {
      this.isDead = true;
      this.state.setState("dead");
    } else {
      this.state.setState("hit", { source });
    }
  }

  getAttackTargets(scene) {
    return scene.enemies;
  }
}
