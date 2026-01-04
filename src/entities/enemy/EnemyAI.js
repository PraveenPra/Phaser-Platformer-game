export class EnemyAI {
  constructor() {
    this.direction = 1; // 1 = right, -1 = left
    this.mode = "patrol";
    // Patrol timer
    this.patrolTimer = 0;
    this.patrolInterval = 500; // ms
  }

  update(entity, dt) {
    if (entity.isDead || entity.state.current === "hit") return;

    if (this.mode === "patrol") {
      this.patrolTimer += dt;
      if (this.patrolTimer >= this.patrolInterval) {
        this.turn();
        this.patrolTimer = 0;
      }

      entity.input = {
        left: this.direction < 0,
        right: this.direction > 0,
        jump: false,
      };
    }
  }

  turn() {
    this.direction *= -1;
  }
}
