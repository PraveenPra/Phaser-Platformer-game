export class MobileControls {
  constructor(scene, playerInput) {
    this.scene = scene;
    this.input = playerInput;

    // button config
    const margin = 16;
    const size = 64;
    const cam = scene.cameras.main;
    const w = cam.width;
    const h = cam.height;

    // LEFT
    this.leftBtn = scene.add
      .sprite(
        margin + size / 2,
        h - margin - size / 2,
        "mobile-buttons",
        "arrow-left-button",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setOrigin(0.5)
      .setDisplaySize(size, size);

    // RIGHT
    this.rightBtn = scene.add
      .sprite(
        margin + size * 1.5,
        h - margin - size / 2,
        "mobile-buttons",
        "arrow-right-button",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setOrigin(0.5)
      .setDisplaySize(size, size);

    // JUMP (UP)
    this.jumpBtn = scene.add
      .sprite(
        w - margin - size / 2,
        h - margin - size / 2,
        "mobile-buttons",
        "arrow-up-button",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setOrigin(0.5)
      .setDisplaySize(size, size);

    // ATTACK (A)
    this.attackBtn = scene.add
      .sprite(
        w - margin - size * 1.5,
        h - margin - size / 2,
        "mobile-buttons",
        "button-A",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setOrigin(0.5)
      .setDisplaySize(size, size);

    // setup pointer events
    const setupBtn = (btn, key) => {
      btn.on("pointerdown", () => (this.input.virtual[key] = true));
      btn.on("pointerup", () => (this.input.virtual[key] = false));
      btn.on("pointerout", () => (this.input.virtual[key] = false));
    };

    setupBtn(this.leftBtn, "left");
    setupBtn(this.rightBtn, "right");
    setupBtn(this.jumpBtn, "jump");
    setupBtn(this.attackBtn, "attackMain");
  }

  // update not needed, PlayerInput handles virtual keys automatically
}
