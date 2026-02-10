import { CharacterBody } from "./CharacterBody.js";
import { CharacterVisual } from "./CharacterVisual.js";
import { StateMachine } from "../../systems/StateMachine.js";
import { CharacterHealthBar } from "./CharacterHealthBar.js";
import { CombatController } from "../../systems/CombatController.js";
import { MovementController } from "../../systems/MovementController.js";
import { GroundMovement } from "../../systems/GroundMovement.js";
import { AirMovement } from "../../systems/AirMovement.js";
import { MultiDomainMovement } from "../../systems/MultiDomainMovement.js";
import { UnifiedStates } from "../common/states/UnifiedStates.js";
import { doHitFlash } from "./vfx/doHitFlash.js";
import { GameState } from "/src/GameState.js";
import { ReactionApplier } from "/src/entities/common/combat/ReactionApplier.js";
import { HitReactions } from "/src/entities/common/combat/HitReactions.js";
import { StatusEffectManager } from "../common/status/StatusEffectManager.js";

export class Character extends Phaser.GameObjects.Container {
  constructor(scene, x, y, textureKey, profile, initialState) {
    super(scene, x, y);
    scene.add.existing(this);

    this.key = textureKey;
    this.profile = profile;

    this.bodyLayer = new CharacterBody(scene, this, profile);
    this.visual = new CharacterVisual(scene, this, textureKey, profile);
    this.statusEffects = new StatusEffectManager(this);

    // Decide initial FSM state based on default movement domain
    let startState = initialState;
    this.jumpCount = 0;

    // ✅ MUST exist before FSM
    // Determine which states to use
    if (profile.movement?.mode === "multi-domain") {
      this.movement = new MultiDomainMovement(this, profile.movement);
      const def = profile.movement.default || "ground";
      this.movement.switchDomain(def);
      startState = def === "air" ? "airIdle" : "idle";
    } else if (profile.movement?.mode === "air") {
      this.movement = new AirMovement(this);
      this.bodyLayer.body.setAllowGravity(false);
      startState = "airIdle";
    } else {
      this.movement = new GroundMovement(this);
      startState = "idle";
    }

    // 🧠 movement capability flags (USED BY UnifiedStates)
    const mode = profile.movement?.mode;

    this.canGround =
      mode === "ground" ||
      (mode === "multi-domain" && profile.movement.domains.includes("ground"));

    this.canAir =
      mode === "air" ||
      (mode === "multi-domain" && profile.movement.domains.includes("air"));

    this.state = new StateMachine(this, startState, UnifiedStates);
    this.combat = new CombatController(this);

    this.attackCooldowns = {};
    this.isAttacking = false;
    this.currentAttackKey = null;
    this.requestedAttack = null;

    this.healthBar = null;

    console.log(
      "[HB INIT]",
      this.key,
      "type=",
      this.type,
      "healthBar=",
      !!this.healthBar,
    );

    // combat runtime state
    // this.currentHp = profile.combat.maxHp;
    this.isInvincible = false;
    this.isDead = false;

    if (this.type === "player") {
      this.stats.on("invincible-start", () => {
        doHitFlash(this.visual.sprite);
        this.isInvincible = true;
      });

      this.stats.on("invincible-end", () => {
        this.isInvincible = false;
      });
    }
  }

  update(dt) {
    this.state.update(dt);
    this.statusEffects.update(dt);
  }

  canAttack(name) {
    const now = this.scene.time.now;
    const cd = this.attackCooldowns[name] || 0;
    return now >= cd && !this.isAttacking;
  }

  startCooldown(name, duration) {
    this.attackCooldowns[name] = this.scene.time.now + duration;
  }

  takeDamage(damage) {
    const { amount, hitReaction } = damage;

    if (this.isDead || this.isInvincible) return;

    if (hitReaction) {
      const reaction = HitReactions[hitReaction];
      ReactionApplier.apply(this, reaction, damage);
    }

    this.stats.takeDamage(amount);

    doHitFlash(this.visual.sprite);

    if (this.type === "enemy") {
      if (this.healthBar && !this.healthBar.graphics.visible) {
        this.healthBar.show();
      }
      this.healthBar?.draw();
    }

    if (this.stats.runtime.isDead) {
      this.isDead = true;
      this.state.setState("dead");
    }
  }

  // ======================
  // EFFECT / DOT DAMAGE
  // ======================
  applyEffectDamage(amount) {
    if (this.isDead) return;

    this.stats.takeDamage(amount);

    if (this.stats.runtime.isDead) {
      this.isDead = true;
      this.state.setState("dead");
    }
  }

  getBaseAttackPower() {
    return this.stats?.attack ?? 1;
  }

  getAttackDamageMultiplier(attack) {
    return attack.power ?? 1;
  }

  getOutgoingDamage(attack) {
    const base = this.getBaseAttackPower();
    const multiplier = this.getAttackDamageMultiplier(attack);

    return Math.round(base * multiplier);
  }
}
