export const GroundStates = {
  idle: {
    enter(entity) {
      entity.visual.play(`${entity.key}_idle`);
      entity.bodyLayer.body.setVelocityX(0);
    },

    update(entity) {
      if (entity.input?.left || entity.input?.right) {
        entity.state.setState("run");
      }
      if (entity.input?.jump && entity.bodyLayer.body.onFloor()) {
        entity.state.setState("jump");
      }
    },
  },

  run: {
    enter(entity) {
      entity.visual.play(`${entity.key}_run`);
    },

    update(entity) {
      const body = entity.bodyLayer.body;
      const speed = entity.profile.move.speed;

      if (entity.input?.left) {
        body.setVelocityX(-speed);
        entity.visual.flip(true);
      } else if (entity.input?.right) {
        body.setVelocityX(speed);
        entity.visual.flip(false);
      } else {
        entity.state.setState("idle");
      }

      if (entity.input?.jump && body.onFloor()) {
        entity.state.setState("jump");
      }
    },
  },

  jump: {
    enter(entity) {
      entity.visual.play(`${entity.key}_jump`);
      entity.bodyLayer.body.setVelocityY(-entity.profile.move.jump);
    },

    update(entity) {
      if (entity.bodyLayer.body.onFloor()) {
        entity.state.setState("idle");
      }
    },
  },
};
