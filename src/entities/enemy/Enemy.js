import { Character } from "../common/Character.js";
import { resolveProfile } from "../digimon/resolveProfile.js";
import { EnemyAI } from "./ai/EnemyAI.js";
import { CharacterHealthBar } from "../common/CharacterHealthBar.js";
import { EnemyFactory } from "./EnemyFactory.js";
import { EnemyArchetypes } from "./EnemyArchetypes.js";

export class Enemy extends Character {
  constructor(scene, x, y, textureKey, spawnConfig = {}) {
    const profile = resolveProfile(textureKey);
    const { level = 1, role = "grunt" } = spawnConfig;

    super(scene, x, y, textureKey, profile, "idle");

    this.type = "enemy";
    this.role = "enemy";

    this.healthBar = new CharacterHealthBar(scene, this, {
      visible: false, // show only on hit
    });

    // not let others push enemy
    this.bodyLayer.body.setImmovable(true);
    this.bodyLayer.body.pushable = false;
    // optional

    const baseStats = {
      maxHp: 20,
      attack: 5,
    };

    this.archetype = EnemyArchetypes[role] ?? EnemyArchetypes.grunt;
    this.combatRules = this.archetype.combatRules;

    this.stats = EnemyFactory.createStats({
      base: baseStats,
      level,
      role,
    });

    this.ai = new EnemyAI({
      engagement: this.archetype.engagement,
    });

    console.log(`[Enemy Spawned] ${textureKey}`, {
      role,
      level,
      stats: this.stats,
    });
    console.log("AI profile:", this.archetype.aiProfile);

    this.combatTime = 0;
    this.lastAttackKey = null;
    this.lastAttackTime = 0;
  }

  update(dt) {
    // 🔒 hit & dead override AI
    if (
      this.state.current === "hit" ||
      this.state.current === "launch" ||
      this.state.current === "airRecover" ||
      this.state.current === "dead"
    ) {
      super.update(dt);
      return;
    }

    this.ai.update(this, dt);
    super.update(dt);

    if (this.ai?.mode === "aggro") {
      if (this.combatTime === 0) {
        // entering combat
        this._hasAttacked = false;
        this._forcedSkillUsed = false;
      }
      this.combatTime += dt;
    } else {
      this.combatTime = 0;
    }
  }

  onDeathAnimationComplete() {
    const sprite = this.visual.sprite;

    // fade out
    this.scene.tweens.add({
      targets: sprite,
      alpha: 0,
      duration: 500,
      ease: "Linear",
      onComplete: () => {
        // remove from enemy group
        if (this.scene.enemies) {
          this.scene.enemies.remove(this, true, true);
        }

        // destroy debug graphics
        this.ai.destroyDebug();

        // destroy entity
        this.destroy();
      },
    });

    // used by survival mode to track kills
    this.scene.events.emit("enemyKilled", this);
  }

  getAttackTargets(scene) {
    return scene.player ? [scene.player] : [];
  }

  pickAttack(context = {}) {
    const allowed = this.archetype.allowedAttacks ?? ["main"];
    const bias = this.archetype.attackBias ?? {};

    const viable = allowed.filter(
      (key) =>
        this.profile.attacks?.[key] &&
        this.canAttack(key) &&
        this.canUseAttackInContext(key, context),
    );

    if (viable.length === 0) return "main";

    // 🔥 opener bias (first attack after aggro)
    if (!this._hasAttacked && Math.random() < (bias.openerChance ?? 0)) {
      const skills = viable.filter((k) => k !== "main");
      if (skills.length) {
        this._hasAttacked = true;
        return skills[Math.floor(Math.random() * skills.length)];
      }
    }

    this._hasAttacked = true;

    // 🔥 elite identity guarantee
    if (this.archetype?.forceSkillOnce && !this._forcedSkillUsed) {
      const skills = viable.filter((k) => k !== "main");
      if (skills.length) {
        this._forcedSkillUsed = true;
        return skills[Math.floor(Math.random() * skills.length)];
      }
    }

    // 🎲 weighted pool
    const pool = [];

    for (const key of viable) {
      const weight = key === "main" ? 1 : (bias.skillWeight ?? 1);
      for (let i = 0; i < weight; i++) pool.push(key);
    }

    return pool[Math.floor(Math.random() * pool.length)];
  }

  canUseAttackInContext(attackKey, context = {}) {
    const attack = this.profile.attacks?.[attackKey];
    if (!attack) return false;

    const {
      distance = 0,
      now = performance.now(),
      playerAirborne = false,
      playerAttacking = false,
      enemyHpPct = 1,
    } = context;

    // 1️⃣ Distance gating (optional per attack)
    if (attack.minRange && distance < attack.minRange) return false;
    if (attack.maxRange && distance > attack.maxRange) return false;

    // 2️⃣ Allow elites to reuse skills faster
    const repeatLock = this.archetype?.repeatAttackLockMs ?? 1200;

    if (
      this.lastAttackKey === attackKey &&
      now - this.lastAttackTime < repeatLock
    ) {
      return false;
    }

    // 3️⃣ Fight time gating (skills unlock time)
    const unlockTime = this.archetype?.skillUnlockTime ?? 0;

    if (attackKey !== "main" && this.combatTime < unlockTime) {
      return false;
    }

    // =========================
    // 🔥 PHASE 3B.2 — CONTEXT
    // =========================

    // 1️⃣ Anti-air logic
    if (attack.antiAir && !playerAirborne) {
      return false;
    }

    // 2️⃣ Punish logic (player mid-attack)
    if (attack.punish && !playerAttacking) {
      return false;
    }

    // 3️⃣ Desperation skills (low HP)
    if (attack.desperation && enemyHpPct > 0.35) {
      return false;
    }

    return true;
  }

  commitAttack(attackKey) {
    this.lastAttackKey = attackKey;
    this.lastAttackTime = performance.now();
  }
}
