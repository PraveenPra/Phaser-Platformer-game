export class EnemyAI {
  constructor() {
    this.direction = 1; // 1 = right, -1 = left

    // Patrol timer
    this.patrolTimer = 0;
    this.patrolInterval = 2000; // ms
  }

  update(entity, dt) {
    // Update patrol timer
    this.patrolTimer += dt;
    if (this.patrolTimer >= this.patrolInterval) {
      this.turn();
      this.patrolTimer = 0;
    }

    // Set entity input
    entity.input = {
      left: this.direction < 0,
      right: this.direction > 0,
      jump: false,
    };
  }

  turn() {
    this.direction *= -1;
  }
}
