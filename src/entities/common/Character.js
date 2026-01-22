import { CharacterBody } from "./CharacterBody.js";
import { CharacterVisual } from "./CharacterVisual.js";
import { StateMachine } from "../../systems/StateMachine.js";
import { CharacterHealthBar } from "./CharacterHealthBar.js";
import { CombatController } from "../../systems/CombatController.js";
import { MovementController } from "../../systems/MovementController.js";
import { GroundMovement } from "../../systems/GroundMovement.js";
import { AirMovement } from "../../systems/AirMovement.js";
import { AirStates } from "../common/states/airStates.js";
import { GroundStates } from "../common/states/groundStates.js";
import { MultiDomainMovement } from "../../systems/MultiDomainMovement.js";
import { UnifiedStates } from "../common/states/UnifiedStates.js";

export class Character extends Phaser.GameObjects.Container {
  constructor(scene, x, y, textureKey, profile, initialState) {
    super(scene, x, y);
    scene.add.existing(this);

    this.key = textureKey;
    this.profile = profile;

    this.bodyLayer = new CharacterBody(scene, this, profile);
    this.visual = new CharacterVisual(scene, this, textureKey, profile);

    // ✅ MUST exist before FSM
    // Determine which states to use
    // movement stays as-is (GroundMovement / AirMovement / MultiDomainMovement)
    if (profile.movement?.mode === "multi-domain") {
      this.movement = new MultiDomainMovement(this, profile.movement);
    } else if (profile.movement?.mode === "air") {
      this.movement = new AirMovement(this);
      this.bodyLayer.body.setAllowGravity(false);
    } else {
      this.movement = new GroundMovement(this);
    }

    // 🔑 Initialize default movement domain
    if (profile.movement?.mode === "multi-domain") {
      const def = profile.movement.default || "ground";
      this.movement.switchDomain(def);
    }

    // --- movement capabilities ---
    // 🧠 movement capability flags (USED BY UnifiedStates)
    const mode = profile.movement?.mode;

    this.canGround =
      mode === "ground" ||
      (mode === "multi-domain" && profile.movement.domains.includes("ground"));

    this.canAir =
      mode === "air" ||
      (mode === "multi-domain" && profile.movement.domains.includes("air"));

    this.state = new StateMachine(this, initialState, UnifiedStates);
    this.combat = new CombatController(this);

    this.attackCooldowns = {};
    this.isAttacking = false;
    this.currentAttackKey = null;
    this.requestedAttack = null;

    // if (this.type === "enemy") {
    //   this.healthBar = new CharacterHealthBar(scene, this, {
    //     visible: false,
    //   });
    // }
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
    this.currentHp = profile.combat.maxHp;
    this.isInvincible = false;
    this.isDead = false;
  }

  update(dt) {
    // this.combat.update(dt);
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
      `[DAMAGE] ${this.key} took ${amount} dmg from ${source?.key} | HP=${this.currentHp}`,
    );

    // 🔥 SHOW bar only when hit
    if (this.healthBar && !this.healthBar.graphics.visible) {
      this.healthBar.show();
    }
    this.healthBar?.draw();

    if (this.currentHp <= 0) {
      this.isDead = true;
      this.state.setState("dead");
    } else {
      this.state.setState("hit", { source });
    }
  }

  // getAttackTargets(scene) {
  //   return scene.enemies;
  // }
}
