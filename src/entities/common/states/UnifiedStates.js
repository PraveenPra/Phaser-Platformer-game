import { startWingFlap, stopWingFlap } from "/src/utils/StateMachineUtils.js";
import { AudioManager } from "/src/systems/AudioManager.js";
import { GameState } from "/src/GameState.js";

function handleAttackInputs(e) {
  if (e.isDead || e.isAttacking) return false;

  if (e.input?.attackMain) {
    e.requestedAttack = "main";
    e.state.setState("attack");
    return true;
  }

  if (e.input?.attackSkill1) {
    e.requestedAttack = "skill1";
    e.state.setState("attack");
    return true;
  }

  if (e.input?.attackSkill2) {
    e.requestedAttack = "skill2";
    e.state.setState("attack");
    return true;
  }

  if (e.input?.attackSkill3) {
    e.requestedAttack = "skill3";
    e.state.setState("attack");
    return true;
  }

  if (e.input?.attackSkill4) {
    e.requestedAttack = "skill4";
    e.state.setState("attack");
    return true;
  }

  return false;
}

export const UnifiedStates = {
  idle: {
    enter(e) {
      e.movement.stop();

      // // AIR-ONLY idle = hover
      // if (!e.canGround && e.canAir) {
      //   console.error("AIR-ONLY IDLE");
      //   e.visual.play(`${e.key}_fly`, true);
      //   e.visual.sprite.anims.timeScale = 0.3;
      //   return;
      // }
      // ground / hybrid idle
      e.visual.play(`${e.key}_idle`);
    },

    update(e) {
      if (handleAttackInputs(e)) return;

      const body = e.bodyLayer.body;

      // AIR-ONLY DIGIMON
      // if (!e.canGround && e.canAir) {
      //   if (e.input?.left || e.input?.right || e.input?.up || e.input?.down) {
      //     e.state.setState("fly");
      //   }
      //   return;
      // }

      // GROUND / HYBRID
      if (body.onFloor()) {
        if (e.input?.left || e.input?.right) {
          e.state.setState("run");
          return;
        }

        if (e.input?.jump && e.canGround) {
          e.state.setState("jump");
          return;
        }
      }

      // ❗ DO NOTHING while falling
    },
  },

  run: {
    enter(e) {
      // air-only should never run
      // if (!e.canGround && e.canAir) {
      //   e.state.setState("fly");
      //   return;
      // }

      e.visual.play(`${e.key}_run`);
    },

    update(e) {
      if (handleAttackInputs(e)) return;

      const body = e.bodyLayer.body;

      // if (!e.canGround) {
      //   e.state.setState("fly");
      //   return;
      // }

      // if (!body.onFloor()) {
      //   if (e.canAir) {
      //     e.state.setState("fly");
      //   } else {
      //     e.state.setState("idle");
      //   }
      //   return;
      // }

      if (e.input?.left) e.movement.moveHorizontal(-1);
      else if (e.input?.right) e.movement.moveHorizontal(1);
      else e.state.setState("idle");

      if (e.input?.jump) e.state.setState("jump");
    },
  },

  jump: {
    enter(e) {
      if (!e.canGround) return;

      e.jumpCount ??= 0;
      e.jumpCount = 1;

      e.visual.play(`${e.key}_jump`);
      e.movement.jump(); // normal ground jump
    },

    update(e) {
      if (handleAttackInputs(e)) return;
      const body = e.bodyLayer.body;

      // SECOND JUMP → takeoff to air
      if (e.canAir && !body.onFloor() && e.input?.jump && e.jumpCount === 1) {
        e.jumpCount = 2;
        e.movement.switchDomain("air");
        e.state.setState("airIdle");
        return;
      }

      // LAND → reset
      if (body.onFloor()) {
        if (e.canGround && e.movement.switchDomain) {
          e.movement.switchDomain("ground");
        }
        e.jumpCount = 0;
        e.state.setState("idle");
      }
    },
  },

  airIdle: {
    enter(e) {
      const body = e.bodyLayer.body;
      const move = e.profile.move;

      body.setAllowGravity(false);
      body.setAcceleration(0, 0);
      body.setDrag(move.airDecel, move.airDecel);

      e.visual.play(`${e.key}_fly`, true);
      e.visual.sprite.anims.timeScale = 0.3;

      e.movement.stop();

      // hover tween (container, not sprite)
      e._hoverTween = e.scene.tweens.add({
        targets: e,
        y: e.y - 8,
        duration: 700,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    },

    update(e) {
      if (handleAttackInputs(e)) return;

      const body = e.bodyLayer.body;

      if (e.input?.left || e.input?.right || e.input?.up || e.input?.down) {
        e.state.setState("fly");
        return;
      }

      // land automatically
      if (e.canGround && body.onFloor()) {
        e.movement.switchDomain("ground");
        e.state.setState("idle");
      }
    },

    exit(e) {
      if (e._hoverTween) {
        e._hoverTween.stop();
        e._hoverTween = null;
      }

      const body = e.bodyLayer.body;
      body.setAcceleration(0, 0);
      body.setDrag(0, 0);

      e.visual.sprite.anims.timeScale = 1;
    },
  },

  fly: {
    enter(e) {
      e.visual.play(`${e.key}_fly`, true);
      e.visual.sprite.anims.timeScale = 1;

      startWingFlap(e);
    },

    update(e) {
      if (handleAttackInputs(e)) return;

      let moving = false;

      if (e.input?.left) {
        e.movement.moveHorizontal(-1);
        moving = true;
      } else if (e.input?.right) {
        e.movement.moveHorizontal(1);
        moving = true;
      }

      if (e.input?.up) {
        e.movement.moveVertical(-1);
        moving = true;
      } else if (e.input?.down) {
        e.movement.moveVertical(1);
        moving = true;
      }

      // 🔻 ONE-TIME LAND
      if (e.bodyLayer.body.onFloor() && e.canGround) {
        e.movement.switchDomain("ground");
        e.state.setState("idle");
        e.jumpCount = 0;

        return;
      }

      if (!moving) {
        e.movement.stop();
        e.state.setState("airIdle");
        return;
      }
    },

    exit(e) {
      stopWingFlap(e);
    },
  },

  attack: {
    enter(e) {
      if (e.isDead) return;

      const attackKey = e.requestedAttack;
      e.combat.execute(attackKey);
    },

    update(e) {
      if (e.isDead) return;

      // Wait until combat system releases control
      if (!e.isAttacking && !e.isDead) {
        if (e.canAir && !e.bodyLayer.body.onFloor()) {
          e.state.setState("airIdle");
        } else {
          e.state.setState("idle");
        }
      }
    },
  },

  hit: {
    enter(e) {
      if (e.isDead) return;

      e.isInvincible = true;
      e.isAttacking = false;

      const body = e.bodyLayer.body;
      body.setVelocity(0, 0);
      body.setAcceleration(0, 0);
      body.setDrag(1000, 1000);

      AudioManager.playSFX(e.scene, "sfx-hurt", { volume: 0.9 });
      e.visual.play(`${e.key}_take-hit`);

      const baseStun = 300;
      const stun = e.hitStunMultiplier
        ? baseStun * e.hitStunMultiplier
        : baseStun;

      e.scene.time.delayedCall(stun, () => {
        if (!e.isDead) {
          if (e.canAir && !body.onFloor()) {
            e.state.setState("airIdle");
          } else {
            e.state.setState("idle");
          }
        }
      });
    },

    update() {},

    exit(e) {
      e.isInvincible = false;

      const body = e.bodyLayer.body;
      body.setDrag(0, 0);
      body.setAcceleration(0, 0);
    },
  },

  dead: {
    enter(e) {
      e.isDead = true;
      e.isInvincible = true;

      const body = e.bodyLayer.body;
      body.setVelocity(0, 0);
      body.setAcceleration(0, 0);
      body.setAllowGravity(false);
      body.moves = false;

      if (e.healthBar) e.healthBar.destroy();

      // Only play gameover SFX for the player
      let sfx = null;
      if (e.type === "player" && GameState.audio.sfxEnabled) {
        sfx = e.scene.sound.add("sfx-gameover", {
          volume: 0.9,
        });
        sfx.play();
      }

      const animKey = `${e.key}_defeated`;
      e.visual.play(animKey);

      let animDone = false;
      let sfxDone = !sfx; // if no SFX, treat as already done

      const tryFinishDeath = () => {
        if (animDone && sfxDone) {
          e.onDeathAnimationComplete?.();
        }
      };

      // Animation complete
      e.visual.onAnimComplete(animKey, () => {
        animDone = true;
        tryFinishDeath();
      });

      // SFX complete
      if (sfx) {
        sfx.once("complete", () => {
          sfxDone = true;
          tryFinishDeath();
        });
      }

      // 💣 cleanup hitboxes
      if (e._activeHitboxes) {
        for (const hb of e._activeHitboxes) {
          if (hb.active) hb.destroy();
        }
        e._activeHitboxes.clear();
      }
    },

    update() {}, // terminal
  },

  preEvolution: {
    enter(e) {
      const body = e.bodyLayer.body;

      e._lockedY = e.y;

      body.setVelocity(0, 0);
      body.setAcceleration(0, 0);
      body.setDrag(0, 0);
      body.setAllowGravity(false);

      e.movement.stop();
      e.visual.sprite.anims.pause();

      if (e._hoverTween) {
        e._hoverTween.stop();
        e._hoverTween = null;
      }

      e.isInvincible = true;
    },

    update(e) {
      e.y = e._lockedY;
    },

    exit(e) {
      delete e._lockedY;
    },
  },

  postEvolution: {
    enter(e) {
      const body = e.bodyLayer.body;

      e._lockedY = e.y;

      body.setVelocity(0, 0);
      body.setAcceleration(0, 0);
      body.setAllowGravity(false);

      e.movement.stop();
      e.visual.sprite.anims.pause();
    },

    update(e) {
      e.y = e._lockedY;
    },

    exit(e) {
      const body = e.bodyLayer.body;

      body.setAllowGravity(true);
      e.visual.sprite.anims.resume();
      e.isInvincible = false;

      delete e._lockedY;
    },
  },
};
