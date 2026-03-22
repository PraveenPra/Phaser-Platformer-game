import { EnemyAI } from "../EnemyAI.js";

export class SurvivalBaseAI extends EnemyAI {
  constructor(config = {}) {
    super(config);

    // survival enemies start aggressive
    this.mode = "aggro";

    // no territory logic
    this.spawnX = null;
    this.patrolRadius = Infinity;
  }

  update(entity, dt) {
    const player = entity.scene.player;

    if (!player || player.isDead || entity.isDead) {
      entity.input = {};
      return;
    }

    // survival enemies never patrol
    this.updateAggroMode(entity, dt);
  }

  updateAggroMode(entity, dt) {
    // subclasses override
  }
}
