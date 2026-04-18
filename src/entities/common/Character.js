import { CharacterBody } from "./CharacterBody.js";
import { CharacterVisual } from "./CharacterVisual.js";
import { StateMachine } from "../../systems/StateMachine.js";
import { CombatController } from "../../systems/CombatController.js";
import { GroundMovement } from "../../systems/GroundMovement.js";
import { AirMovement } from "../../systems/AirMovement.js";
import { MultiDomainMovement } from "../../systems/MultiDomainMovement.js";
import { UnifiedStates } from "../common/states/UnifiedStates.js";
import { doHitFlash } from "./vfx/doHitFlash.js";
import { ReactionApplier } from "/src/entities/common/combat/ReactionApplier.js";
import { HitReactions } from "/src/entities/common/combat/HitReactions.js";
import { StatusEffectManager } from "../common/status/StatusEffectManager.js";
import { createDamagePacket } from "/src/combat/DamageTypes.js";
import { ReactionResolver } from "/src/combat/ReactionResolver.js";

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

    this.speedMultiplier = 1; // For global speed buffs/debuffs

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

  receiveDamage(packet) {
    if (!this.stats) return;

    const result = this.stats.applyDamage(packet);

    if (!result.applied) return;

    // ======================
    // HIT REACTION (RULED)
    // ======================
    if (!packet.flags?.dot && packet.hitReaction) {
      const allowed = ReactionResolver.canApplyReaction(
        this,
        packet.hitReaction,
      );

      if (allowed) {
        const reaction = HitReactions[packet.hitReaction];
        ReactionApplier.apply(this, reaction, packet);
      }
    }

    if (!packet.flags?.dot) {
      doHitFlash(this.visual.sprite);
    }

    if (this.type === "enemy") {
      this.healthBar?.show();
      this.healthBar?.draw();
    }

    if (result.killed) {
      this.isDead = true;
      this.state.setState("dead");
    }

    return result;
  }

  // ======================
  // EFFECT / DOT DAMAGE
  // ======================
  applyEffectDamage(amount) {
    if (!this.stats || this.isDead) return;

    const packet = createDamagePacket({
      amount,
      source: null, // DOT has no direct attacker
      type: "dot",
      flags: {
        dot: true,
        ignoresHitReaction: true,
        ignoresInvincibility: true,
      },
    });

    this.receiveDamage(packet);
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

  destroy(fromScene) {
    this.statusEffects?.clearAll();
    super.destroy(fromScene);
  }
}
