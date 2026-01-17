export class SceneControls {
  constructor(scene, config = {}) {
    this.scene = scene;

    // defaults
    this.keyPause = config.keyPause || "ESC";
    this.allowTimeScale = config.allowTimeScale ?? true;

    this.isPaused = false;

    this._registerKeys();
  }

  // =========================
  // INPUT
  // =========================
  _registerKeys() {
    const scene = this.scene;

    this.pauseKey = scene.input.keyboard.addKey(this.keyPause);

    this.pauseKey.on("down", () => {
      if (this.isPaused) {
        this.resume();
      } else {
        this.pause();
      }
    });
  }

  // =========================
  // PAUSE / RESUME
  // =========================
  pause() {
    if (this.isPaused) return;

    const scene = this.scene;

    this.isPaused = true;

    // stop physics
    scene.physics.world.pause();

    // pause animations
    scene.anims.pauseAll();

    // optional: slow time (nice effect)
    if (this.allowTimeScale) {
      scene.time.timeScale = 0;
    }

    // notify scene if needed
    scene.events.emit("scene-paused");
  }

  resume() {
    if (!this.isPaused) return;

    const scene = this.scene;

    this.isPaused = false;

    scene.physics.world.resume();
    scene.anims.resumeAll();

    scene.time.timeScale = 1;

    scene.events.emit("scene-resumed");
  }

  // =========================
  // OPTIONAL UTILITIES
  // =========================
  togglePause() {
    this.isPaused ? this.resume() : this.pause();
  }

  slowMo(scale = 0.3) {
    if (!this.allowTimeScale) return;
    this.scene.time.timeScale = scale;
  }

  normalSpeed() {
    this.scene.time.timeScale = 1;
  }

  destroy() {
    this.pauseKey?.destroy();
  }
}
