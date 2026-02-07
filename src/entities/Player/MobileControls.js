export class MobileControls {
  constructor(scene, playerInput) {
    this.scene = scene;
    this.input = playerInput;

    const cam = scene.cameras.main;
    const margin = 16;
    const size = 64;

    // LEFT BUTTON
    this.leftBtn = scene.add
      .sprite(
        margin + size / 2,
        cam.height - margin - size / 2,
        "mobile-buttons",
        "mb-left-button",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setOrigin(0.5)
      .setDisplaySize(size, size);

    // RIGHT BUTTON
    this.rightBtn = scene.add
      .sprite(
        margin + size * 1.5,
        cam.height - margin - size / 2,
        "mobile-buttons",
        "mb-right-button",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setOrigin(0.5)
      .setDisplaySize(size, size);

    // JUMP BUTTON
    this.jumpBtn = scene.add
      .sprite(
        cam.width - margin - size / 2,
        cam.height - margin - size / 2,
        "mobile-buttons",
        "mb-up-button",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setOrigin(0.5)
      .setDisplaySize(size, size);

    // ATTACK BUTTON
    this.attackBtn = scene.add
      .sprite(
        cam.width - margin - size * 1.5,
        cam.height - margin - size / 2,
        "mobile-buttons",
        "button-A",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setOrigin(0.5)
      .setDisplaySize(size, size);

    // Setup touch events
    const setupBtn = (btn, key) => {
      const setupBtn = (btn, key) => {
        btn.on("pointerdown", () => {
          this.input.virtual[key] = true;
        });
        btn.on("pointerup", () => {
          this.input.virtual[key] = false;
        });
        btn.on("pointerout", () => {
          this.input.virtual[key] = false;
        });
      };
    };

    setupBtn(this.leftBtn, "left");
    setupBtn(this.rightBtn, "right");
    setupBtn(this.jumpBtn, "jump");
    setupBtn(this.attackBtn, "attackMain");
  }
}
