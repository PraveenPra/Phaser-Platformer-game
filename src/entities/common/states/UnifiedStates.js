export const UnifiedStates = {
  idle: {
    enter(e) {
      e.movement.stop();

      // AIR-ONLY idle = hover
      if (!e.canGround && e.canAir) {
        e.visual.play(`${e.key}_fly`, true);
        e.visual.sprite.anims.timeScale = 0.3;
        return;
      }

      // ground / hybrid idle
      e.visual.play(`${e.key}_idle`);
    },

    update(e) {
      const body = e.bodyLayer.body;

      // AIR-ONLY DIGIMON
      if (!e.canGround && e.canAir) {
        if (e.input?.left || e.input?.right || e.input?.up || e.input?.down) {
          e.state.setState("fly");
        }
        return;
      }

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
      } else if (e.canAir) {
        e.state.setState("fly");
      }
    },
  },

  run: {
    enter(e) {
      // air-only should never run
      if (!e.canGround && e.canAir) {
        e.state.setState("fly");
        return;
      }

      e.visual.play(`${e.key}_run`);
    },

    update(e) {
      const body = e.bodyLayer.body;

      if (!e.canGround) {
        e.state.setState("fly");
        return;
      }

      if (!body.onFloor()) {
        if (e.canAir) {
          e.state.setState("fly");
        } else {
          e.state.setState("idle");
        }
        return;
      }

      if (e.input?.left) e.movement.moveHorizontal(-1);
      else if (e.input?.right) e.movement.moveHorizontal(1);
      else e.state.setState("idle");

      if (e.input?.jump) e.state.setState("jump");
    },
  },

  jump: {
    enter(e) {
      if (!e.canGround) return;

      e.visual.play(`${e.key}_jump`);
      e.movement.jump();

      // ONE-TIME TAKEOFF (hybrid only)
      if (e.canAir && e.movement.switchDomain) {
        e.movement.switchDomain("air");
        e.state.setState("fly");
      }
    },

    update(e) {
      // ✅ ground-only landing recovery
      if (!e.canAir && e.bodyLayer.body.onFloor()) {
        e.state.setState("idle");
      }
    },
  },

  fly: {
    enter(e) {
      e.visual.play(`${e.key}_fly`, true);
      e.visual.sprite.anims.timeScale = 1;
    },

    update(e) {
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
      if (e.input?.jump && e.input?.down && e.canGround) {
        e.movement.switchDomain("ground");
        e.state.setState("idle");
        return;
      }

      if (!moving) e.movement.stop();
    },
  },

  dead: {
    enter(e) {
      e.bodyLayer.body.moves = false;
      e.visual.play(`${e.key}_defeated`);
    },
  },
};
