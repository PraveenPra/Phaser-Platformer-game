export const EnemyGroundStates = {
  idle: {
    enter(entity) {
      entity.visual.play(`${entity.key}_idle`);
      entity.bodyLayer.body.setVelocityX(0);
    },

    update(entity) {
      if (entity.input?.left || entity.input?.right) {
        entity.state.setState("patrol");
      }
    },
  },

  patrol: {
    enter(entity) {
      entity.visual.play(`${entity.key}_run`);
    },

    update(entity) {
      const body = entity.bodyLayer.body;
      const speed = entity.profile.move.speed * 0.6; // enemies slower by default

      if (entity.input?.left) {
        body.setVelocityX(-speed);
        entity.visual.flip(true);
      } else if (entity.input?.right) {
        body.setVelocityX(speed);
        entity.visual.flip(false);
      } else {
        entity.state.setState("idle");
      }
    },
  },
};
