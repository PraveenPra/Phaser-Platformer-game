export class NarrativeOverlay {
  constructor(scene) {
    this.scene = scene;

    const cam = scene.cameras.main;

    this.container = scene.add.container(0, 0).setDepth(1000);

    this.bg = scene.add
      .rectangle(0, 0, cam.width, cam.height, 0x000000, 0.6)
      .setOrigin(0)
      .setScrollFactor(0)
      .setAlpha(0);

    this.text = scene.add
      .text(cam.centerX, cam.centerY, "", {
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: cam.width * 0.8 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setAlpha(0);

    this.container.add([this.bg, this.text]);
  }

  show(entry, onComplete) {
    const { scene } = this;

    // lock input if needed
    if (entry.mode === "blocking" && scene.player) {
      scene.player.inputLocked = true;
    }

    this.text.setText(entry.text);

    scene.tweens.add({
      targets: [this.bg, this.text],
      alpha: 1,
      duration: 500,
    });

    const close = () => {
      scene.tweens.add({
        targets: [this.bg, this.text],
        alpha: 0,
        duration: 400,
        onComplete: () => {
          if (entry.mode === "blocking" && scene.player) {
            scene.player.inputLocked = false;
          }
          onComplete?.();
        },
      });
    };

    if (entry.duration) {
      scene.time.delayedCall(entry.duration, close);
    }

    // allow skip
    scene.input.keyboard.once("keydown-SPACE", close);
  }

  destroy() {
    this.container.destroy();
  }
}
